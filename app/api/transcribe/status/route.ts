import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ASSEMBLY_BASE = "https://api.assemblyai.com/v2";

export async function GET(request: NextRequest) {
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

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const res = await fetch(`${ASSEMBLY_BASE}/transcript/${id}`, {
    headers: { authorization: apiKey },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json(
      { error: `AssemblyAI status fetch failed: ${body}` },
      { status: 502 }
    );
  }

  const data = (await res.json()) as {
    id: string;
    status: "queued" | "processing" | "completed" | "error";
    error?: string;
    text?: string;
    utterances?: Array<{
      speaker: string;
      text: string;
      start?: number;
      end?: number;
    }>;
  };

  return NextResponse.json({
    id: data.id,
    status: data.status,
    error: data.error,
    text: data.text,
    utterances:
      data.utterances?.map((u) => ({
        speaker: u.speaker,
        text: u.text,
        start: u.start,
        end: u.end,
      })) ?? null,
  });
}
