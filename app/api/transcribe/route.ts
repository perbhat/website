import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const ASSEMBLY_BASE = "https://api.assemblyai.com/v2";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ASSEMBLY_SECRET_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server missing ASSEMBLY_SECRET_KEY" },
      { status: 500 }
    );
  }

  let body: { audio_url?: string; speakers_expected?: string | number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const audioUrl = body.audio_url;
  if (!audioUrl || typeof audioUrl !== "string") {
    return NextResponse.json({ error: "Missing audio_url" }, { status: 400 });
  }

  const transcribeBody: Record<string, unknown> = {
    audio_url: audioUrl,
    speaker_labels: true,
  };

  const speakersRaw = body.speakers_expected;
  if (speakersRaw !== undefined && speakersRaw !== "auto") {
    const n = Number(speakersRaw);
    if (Number.isFinite(n) && n >= 1) transcribeBody.speakers_expected = n;
  }

  const transRes = await fetch(`${ASSEMBLY_BASE}/transcript`, {
    method: "POST",
    headers: {
      authorization: apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(transcribeBody),
  });

  if (!transRes.ok) {
    const text = await transRes.text();
    return NextResponse.json(
      { error: `AssemblyAI transcript create failed: ${text}` },
      { status: 502 }
    );
  }

  const transcript = (await transRes.json()) as { id: string };
  return NextResponse.json({ id: transcript.id });
}
