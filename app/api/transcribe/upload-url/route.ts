import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

let storage: Storage | null = null;
function getStorage(): Storage {
  if (storage) return storage;
  const raw = process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing GCP_SERVICE_ACCOUNT_JSON");
  const creds = JSON.parse(raw) as {
    client_email: string;
    private_key: string;
    project_id: string;
  };
  storage = new Storage({
    projectId: creds.project_id,
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
  });
  return storage;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { fileName?: string; contentType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bucketName = process.env.GCS_BUCKET;
  if (!bucketName) {
    return NextResponse.json(
      { error: "Server missing GCS_BUCKET" },
      { status: 500 }
    );
  }

  const fileName = body.fileName || "audio.bin";
  const contentType = body.contentType || "application/octet-stream";
  const ext = (fileName.split(".").pop() || "bin").toLowerCase().slice(0, 8);
  const rand = Math.random().toString(36).slice(2, 10);
  const objectPath = `${user.id}/${Date.now()}-${rand}.${ext}`;

  try {
    const bucket = getStorage().bucket(bucketName);
    const file = bucket.file(objectPath);

    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 min to upload
      contentType,
    });

    const [readUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hr for AssemblyAI
    });

    return NextResponse.json({
      uploadUrl,
      readUrl,
      objectPath,
      contentType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
