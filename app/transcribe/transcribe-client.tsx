"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Utterance = {
  speaker: string;
  text: string;
  start?: number;
  end?: number;
};

type PartStatus =
  | "empty"
  | "uploading"
  | "queued"
  | "processing"
  | "ready"
  | "error";

type SpeakersSetting = "auto" | number;

type Part = {
  id: string;
  number: number;
  fileName: string | null;
  fileSize: number | null;
  status: PartStatus;
  transcriptId: string | null;
  utterances: Utterance[] | null;
  speakerMap: Record<string, string>;
  error: string | null;
  speakers: SpeakersSetting;
};

const MAX_PARTS = 5;
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

const SPEAKER_CHOICES: SpeakersSetting[] = ["auto", 2, 3, 4, 5, 6];

function makePart(number: number): Part {
  return {
    id: `p-${number}-${Math.random().toString(36).slice(2, 8)}`,
    number,
    fileName: null,
    fileSize: null,
    status: "empty",
    transcriptId: null,
    utterances: null,
    speakerMap: {},
    error: null,
    speakers: "auto",
  };
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function resolveName(map: Record<string, string>, speaker: string) {
  const trimmed = map[speaker]?.trim();
  return trimmed || `Speaker ${speaker}`;
}

export default function TranscribeClient({
  userEmail,
}: {
  userEmail: string;
}) {
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([makePart(1)]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pollers = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  const active = parts[activeIdx];

  useEffect(() => {
    return () => {
      Object.values(pollers.current).forEach((t) => clearInterval(t));
    };
  }, []);

  function updatePart(id: string, patch: Partial<Part> | ((p: Part) => Partial<Part>)) {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = typeof patch === "function" ? patch(p) : patch;
        return { ...p, ...next };
      })
    );
  }

  function addPart() {
    if (parts.length >= MAX_PARTS) return;
    const n = parts.length + 1;
    setParts((prev) => [...prev, makePart(n)]);
    setActiveIdx(parts.length);
  }

  function removePart(id: string) {
    setParts((prev) => {
      const filtered = prev
        .filter((p) => p.id !== id)
        .map((p, i) => ({ ...p, number: i + 1 }));
      const safe = filtered.length > 0 ? filtered : [makePart(1)];
      return safe;
    });
    setActiveIdx((i) => Math.max(0, Math.min(i, parts.length - 2)));
    const poller = pollers.current[id];
    if (poller) {
      clearInterval(poller);
      delete pollers.current[id];
    }
  }

  function startPolling(partId: string, transcriptId: string) {
    const existing = pollers.current[partId];
    if (existing) clearInterval(existing);

    const tick = async () => {
      try {
        const res = await fetch(`/api/transcribe/status?id=${transcriptId}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Status fetch failed");
        }
        if (data.status === "completed") {
          const utts: Utterance[] = data.utterances ?? [];
          const speakerMap: Record<string, string> = {};
          for (const u of utts) {
            if (!(u.speaker in speakerMap)) speakerMap[u.speaker] = "";
          }
          updatePart(partId, {
            status: "ready",
            utterances: utts,
            speakerMap,
            error: null,
          });
          clearInterval(pollers.current[partId]);
          delete pollers.current[partId];
        } else if (data.status === "error") {
          updatePart(partId, {
            status: "error",
            error: data.error || "AssemblyAI reported an error",
          });
          clearInterval(pollers.current[partId]);
          delete pollers.current[partId];
        } else {
          updatePart(partId, { status: data.status });
        }
      } catch (err) {
        updatePart(partId, {
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        });
        clearInterval(pollers.current[partId]);
        delete pollers.current[partId];
      }
    };

    tick();
    pollers.current[partId] = setInterval(tick, 3500);
  }

  async function handleStart(partId: string, file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
      updatePart(partId, {
        status: "error",
        error: `File is ${formatBytes(file.size)}. Max ${formatBytes(MAX_UPLOAD_BYTES)} per part.`,
      });
      return;
    }

    const part = parts.find((p) => p.id === partId);
    if (!part) return;

    updatePart(partId, {
      status: "uploading",
      fileName: file.name,
      fileSize: file.size,
      error: null,
      transcriptId: null,
      utterances: null,
      speakerMap: {},
    });

    try {
      const contentType = file.type || "application/octet-stream";

      const signRes = await fetch("/api/transcribe/upload-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType,
        }),
      });
      const signData = await signRes.json();
      if (!signRes.ok) {
        throw new Error(signData.error || "Could not get upload URL");
      }

      const putRes = await fetch(signData.uploadUrl, {
        method: "PUT",
        headers: { "content-type": contentType },
        body: file,
      });
      if (!putRes.ok) {
        const txt = await putRes.text().catch(() => "");
        throw new Error(`Upload failed: ${putRes.status} ${txt.slice(0, 200)}`);
      }

      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          audio_url: signData.readUrl,
          speakers_expected:
            part.speakers === "auto" ? "auto" : String(part.speakers),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transcription start failed");

      updatePart(partId, {
        transcriptId: data.id,
        status: "queued",
      });
      startPolling(partId, data.id);
    } catch (err) {
      updatePart(partId, {
        status: "error",
        error: err instanceof Error ? err.message : "Upload failed",
      });
    }
  }

  function buildMasterMarkdown() {
    const lines: string[] = [];
    lines.push("# Transcript");
    lines.push("");
    lines.push(`_Generated ${new Date().toISOString().slice(0, 10)}_`);
    lines.push("");

    const readyParts = parts.filter(
      (p) => p.status === "ready" && p.utterances && p.utterances.length > 0
    );

    readyParts.forEach((p, i) => {
      if (i > 0) {
        lines.push("");
        lines.push(`[PART ${p.number}]`);
        lines.push("");
      }
      for (const u of p.utterances!) {
        const name = resolveName(p.speakerMap, u.speaker);
        lines.push(`**${name}:** ${u.text}`);
        lines.push("");
      }
    });

    return lines.join("\n");
  }

  function handleDownload() {
    setDownloading(true);
    try {
      const md = buildMasterMarkdown();
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transcript-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setDownloading(false), 600);
    }
  }

  const readyCount = parts.filter((p) => p.status === "ready").length;
  const anyReady = readyCount > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        overflowY: "auto",
        background: "#EEEAE4",
        color: "#2C2C2C",
        fontFamily: "var(--font-vt323), ui-monospace, monospace",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "32px 24px 80px",
        }}
      >
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#7a6f60",
              textDecoration: "none",
              fontSize: 20,
              letterSpacing: "0.04em",
            }}
          >
            ← back
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 16,
              color: "#7a6f60",
            }}
          >
            <span>{userEmail}</span>
            <span style={{ color: "#c8b99f" }}>·</span>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              style={{
                fontFamily: "var(--font-vt323), monospace",
                fontSize: 16,
                color: "#7a6f60",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              {signingOut ? "..." : "sign out"}
            </button>
          </div>
        </div>

        <HeaderBanner />

        <PartsTabs
          parts={parts}
          activeIdx={activeIdx}
          onSelect={setActiveIdx}
          onAdd={addPart}
          onRemove={removePart}
        />

        <PartPanel
          key={active.id}
          part={active}
          onSpeakersChange={(s) => updatePart(active.id, { speakers: s })}
          onPickFile={() => fileInputRef.current?.click()}
          onStart={(f) => handleStart(active.id, f)}
          onSpeakerNameChange={(label, name) =>
            updatePart(active.id, (p) => ({
              speakerMap: { ...p.speakerMap, [label]: name },
            }))
          }
          onReset={() =>
            updatePart(active.id, {
              status: "empty",
              fileName: null,
              fileSize: null,
              transcriptId: null,
              utterances: null,
              speakerMap: {},
              error: null,
            })
          }
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.m4a,.mp3,.wav,.mp4,.mpga,.webm,.ogg"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleStart(active.id, file);
            e.target.value = "";
          }}
        />

        <ExportBar
          parts={parts}
          readyCount={readyCount}
          canDownload={anyReady}
          downloading={downloading}
          onDownload={handleDownload}
        />

        <Footer />
      </div>
    </div>
  );
}

function HeaderBanner() {
  return (
    <h1
      style={{
        fontFamily: "var(--font-press), monospace",
        fontSize: 22,
        color: "#2C2C2C",
        margin: "0 0 24px",
        lineHeight: 1.2,
        letterSpacing: "0.02em",
        textShadow: "2px 2px 0 #d9cbb0",
      }}
    >
      multi-speaker transcribe
    </h1>
  );
}

function PartsTabs({
  parts,
  activeIdx,
  onSelect,
  onAdd,
  onRemove,
}: {
  parts: Part[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 18,
        alignItems: "center",
      }}
    >
      {parts.map((p, i) => {
        const selected = i === activeIdx;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(i)}
            style={{
              fontFamily: "var(--font-press), monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              padding: "10px 14px",
              border: "3px solid #2C2C2C",
              borderRadius: 4,
              background: selected ? "#2C2C2C" : "#F7F1E6",
              color: selected ? "#F7F1E6" : "#2C2C2C",
              boxShadow: selected ? "0 0 0 #2C2C2C" : "3px 3px 0 #2C2C2C",
              transform: selected ? "translate(3px,3px)" : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>PART {p.number}</span>
            <StatusDot status={p.status} />
            {parts.length > 1 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(p.id);
                }}
                role="button"
                aria-label={`remove part ${p.number}`}
                style={{
                  fontSize: 10,
                  opacity: 0.6,
                  marginLeft: 2,
                }}
              >
                ✕
              </span>
            )}
          </button>
        );
      })}
      {parts.length < MAX_PARTS && (
        <button
          onClick={onAdd}
          style={{
            fontFamily: "var(--font-press), monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            padding: "10px 14px",
            border: "3px dashed #9a8e7d",
            borderRadius: 4,
            background: "transparent",
            color: "#7a6f60",
            cursor: "pointer",
          }}
        >
          + ADD PART
        </button>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: PartStatus }) {
  const color =
    status === "ready"
      ? "#4a8a3a"
      : status === "error"
        ? "#B03A2E"
        : status === "empty"
          ? "#c8b99f"
          : "#D4A843";
  return (
    <span
      style={{
        width: 10,
        height: 10,
        background: color,
        border: "2px solid currentColor",
        borderRadius: 1,
        display: "inline-block",
      }}
    />
  );
}

function PartPanel({
  part,
  onSpeakersChange,
  onPickFile,
  onStart,
  onSpeakerNameChange,
  onReset,
}: {
  part: Part;
  onSpeakersChange: (s: SpeakersSetting) => void;
  onPickFile: () => void;
  onStart: (f: File) => void;
  onSpeakerNameChange: (label: string, name: string) => void;
  onReset: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const distinctSpeakers = useMemo(() => {
    if (!part.utterances) return [];
    const seen: string[] = [];
    for (const u of part.utterances) {
      if (!seen.includes(u.speaker)) seen.push(u.speaker);
    }
    return seen.sort();
  }, [part.utterances]);

  return (
    <section
      style={{
        border: "3px solid #2C2C2C",
        borderRadius: 6,
        background: "#FBF7EE",
        boxShadow: "6px 6px 0 #2C2C2C",
        padding: 22,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-press), monospace",
            fontSize: 14,
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          PART {part.number}
        </h2>
        <span
          style={{
            fontFamily: "var(--font-press), monospace",
            fontSize: 9,
            color: "#9a8e7d",
            letterSpacing: "0.12em",
          }}
        >
          STATUS: {part.status.toUpperCase()}
        </span>
      </div>

      {(part.status === "empty" || part.status === "error") && (
        <>
          <SpeakersPicker value={part.speakers} onChange={onSpeakersChange} />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) onStart(file);
            }}
            onClick={onPickFile}
            style={{
              marginTop: 14,
              border: `3px dashed ${dragOver ? "#2C2C2C" : "#c8b99f"}`,
              background: dragOver ? "#F0E8D7" : "#FDFAF2",
              borderRadius: 4,
              padding: "34px 16px",
              textAlign: "center",
              cursor: "pointer",
              transition: "background 120ms, border-color 120ms",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-press), monospace",
                fontSize: 12,
                letterSpacing: "0.06em",
              }}
            >
              DROP AUDIO
            </div>
          </div>
          {part.status === "error" && part.error && (
            <ErrorBox message={part.error} onReset={onReset} />
          )}
        </>
      )}

      {(part.status === "uploading" ||
        part.status === "queued" ||
        part.status === "processing") && (
        <ProgressBox
          part={part}
          label={
            part.status === "uploading"
              ? "uploading"
              : part.status === "queued"
                ? "in the queue"
                : "transcribing & diarizing"
          }
        />
      )}

      {part.status === "ready" && part.utterances && (
        <ReadyView
          part={part}
          distinctSpeakers={distinctSpeakers}
          onSpeakerNameChange={onSpeakerNameChange}
          onReset={onReset}
        />
      )}
    </section>
  );
}

function SpeakersPicker({
  value,
  onChange,
}: {
  value: SpeakersSetting;
  onChange: (v: SpeakersSetting) => void;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-press), monospace",
          fontSize: 10,
          color: "#5a4f41",
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        SPEAKERS
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {SPEAKER_CHOICES.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={String(opt)}
              onClick={() => onChange(opt)}
              style={{
                fontFamily: "var(--font-press), monospace",
                fontSize: 10,
                letterSpacing: "0.08em",
                padding: "9px 12px",
                border: "3px solid #2C2C2C",
                borderRadius: 4,
                background: selected ? "#D4A843" : "#F7F1E6",
                color: "#2C2C2C",
                boxShadow: selected ? "0 0 0 #2C2C2C" : "2px 2px 0 #2C2C2C",
                transform: selected ? "translate(2px,2px)" : "none",
                cursor: "pointer",
                minWidth: 48,
              }}
            >
              {opt === "auto" ? "AUTO" : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBox({ part, label }: { part: Part; label: string }) {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        border: "3px solid #2C2C2C",
        borderRadius: 4,
        background: "#FDFAF2",
        padding: "22px 18px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-press), monospace",
          fontSize: 12,
          marginBottom: 14,
          letterSpacing: "0.06em",
        }}
      >
        {label}
        {".".repeat(dots)}
      </div>
      <LoadingBar />
      {part.fileName && (
        <div style={{ marginTop: 12, fontSize: 18, color: "#7a6f60" }}>
          {part.fileName}
        </div>
      )}
    </div>
  );
}

function LoadingBar() {
  return (
    <div
      style={{
        height: 16,
        border: "3px solid #2C2C2C",
        borderRadius: 2,
        background: "#EEEAE4",
        overflow: "hidden",
        position: "relative",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(45deg, #D4A843 0 10px, #B88A2F 10px 20px)",
          animation: "transcribe-slide 900ms linear infinite",
        }}
      />
      <style>{`
        @keyframes transcribe-slide {
          from { transform: translateX(-20px); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function ErrorBox({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div
      style={{
        marginTop: 14,
        border: "3px solid #B03A2E",
        borderRadius: 4,
        background: "#FBECE7",
        padding: "14px 16px",
        color: "#6a1f16",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-press), monospace",
          fontSize: 10,
          letterSpacing: "0.1em",
          marginBottom: 6,
        }}
      >
        ✕ ERROR
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.35 }}>{message}</div>
      <button
        onClick={onReset}
        style={{
          marginTop: 10,
          fontFamily: "var(--font-press), monospace",
          fontSize: 10,
          letterSpacing: "0.08em",
          padding: "8px 12px",
          border: "3px solid #B03A2E",
          background: "#B03A2E",
          color: "#FBECE7",
          cursor: "pointer",
          boxShadow: "2px 2px 0 #6a1f16",
        }}
      >
        TRY AGAIN
      </button>
    </div>
  );
}

function ReadyView({
  part,
  distinctSpeakers,
  onSpeakerNameChange,
  onReset,
}: {
  part: Part;
  distinctSpeakers: string[];
  onSpeakerNameChange: (label: string, name: string) => void;
  onReset: () => void;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-press), monospace",
          fontSize: 10,
          color: "#5a4f41",
          letterSpacing: "0.1em",
          marginBottom: 10,
        }}
      >
        NAMES
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 10,
          marginBottom: 22,
        }}
      >
        {distinctSpeakers.map((label) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "3px solid #2C2C2C",
              background: "#FDFAF2",
              padding: "8px 10px",
              boxShadow: "3px 3px 0 #2C2C2C",
              borderRadius: 3,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-press), monospace",
                fontSize: 10,
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </span>
            <span style={{ fontSize: 18, color: "#9a8e7d" }}>→</span>
            <input
              type="text"
              value={part.speakerMap[label] ?? ""}
              onChange={(e) => onSpeakerNameChange(label, e.target.value)}
              placeholder={`name for ${label}`}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "var(--font-vt323), monospace",
                fontSize: 20,
                color: "#2C2C2C",
                minWidth: 0,
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          border: "3px solid #2C2C2C",
          borderRadius: 4,
          background: "#FDFAF2",
          padding: "14px 16px",
          maxHeight: 360,
          overflowY: "auto",
          fontSize: 20,
          lineHeight: 1.5,
        }}
      >
        {part.utterances!.map((u, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <span
              style={{
                fontFamily: "var(--font-press), monospace",
                fontSize: 10,
                color: "#B03A2E",
                letterSpacing: "0.05em",
                marginRight: 8,
              }}
            >
              {resolveName(part.speakerMap, u.speaker).toUpperCase()}:
            </span>
            <span>{u.text}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={onReset}
          style={{
            fontFamily: "var(--font-press), monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            padding: "10px 14px",
            border: "3px solid #2C2C2C",
            background: "#F7F1E6",
            color: "#2C2C2C",
            cursor: "pointer",
            boxShadow: "3px 3px 0 #2C2C2C",
            borderRadius: 3,
          }}
        >
          RE-UPLOAD
        </button>
      </div>
    </div>
  );
}

function ExportBar({
  parts,
  readyCount,
  canDownload,
  downloading,
  onDownload,
}: {
  parts: Part[];
  readyCount: number;
  canDownload: boolean;
  downloading: boolean;
  onDownload: () => void;
}) {
  return (
    <section
      style={{
        border: "3px solid #2C2C2C",
        borderRadius: 6,
        background: "#2C2C2C",
        color: "#F7F1E6",
        boxShadow: "6px 6px 0 #D4A843",
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-press), monospace",
            fontSize: 12,
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          MASTER
        </div>
        <div style={{ fontSize: 18, color: "#d9cbb0" }}>
          {readyCount} / {parts.length} ready
        </div>
      </div>
      <button
        onClick={onDownload}
        disabled={!canDownload || downloading}
        style={{
          fontFamily: "var(--font-press), monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          padding: "14px 18px",
          border: "3px solid #F7F1E6",
          background: canDownload ? "#D4A843" : "#555",
          color: "#2C2C2C",
          cursor: canDownload ? "pointer" : "not-allowed",
          boxShadow: canDownload ? "4px 4px 0 #F7F1E6" : "none",
          borderRadius: 3,
          opacity: downloading ? 0.7 : 1,
        }}
      >
        {downloading ? "SAVING..." : "↓ DOWNLOAD .MD"}
      </button>
    </section>
  );
}

function Footer() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 36,
        color: "#9a8e7d",
        fontSize: 16,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-press), monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
        }}
      >
        MADE WITH &lt;3 BY PERBHAT
      </span>
      <a
        href="https://talktoreview.com/perbhat-kumar"
        target="_blank"
        rel="noopener noreferrer"
        title="Give me feedback"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#3d2f1f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          textDecoration: "none",
          transition: "transform 0.15s, box-shadow 0.15s",
          zIndex: 100,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 14px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#e8ddd0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </a>
    </div>
  );
}
