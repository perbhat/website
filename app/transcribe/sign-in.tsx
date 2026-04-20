"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

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
          maxWidth: 560,
          margin: "0 auto",
          padding: "32px 24px 80px",
        }}
      >
        <div style={{ marginBottom: 28 }}>
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
        </div>

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
          TRANSCRIBE.EXE
        </h1>

        <section
          style={{
            border: "3px solid #2C2C2C",
            borderRadius: 6,
            background: "#FBF7EE",
            boxShadow: "6px 6px 0 #2C2C2C",
            padding: 24,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-press), monospace",
              fontSize: 10,
              color: "#5a4f41",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            SIGN IN
          </div>
          <p style={{ fontSize: 20, margin: "0 0 18px", color: "#5a4f41" }}>
            sign in with google to transcribe voice memos.
          </p>
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              fontFamily: "var(--font-press), monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              padding: "14px 18px",
              border: "3px solid #2C2C2C",
              background: loading ? "#c8b99f" : "#D4A843",
              color: "#2C2C2C",
              cursor: loading ? "wait" : "pointer",
              boxShadow: loading ? "0 0 0 #2C2C2C" : "4px 4px 0 #2C2C2C",
              borderRadius: 3,
            }}
          >
            {loading ? "OPENING GOOGLE..." : "SIGN IN WITH GOOGLE"}
          </button>
          {error && (
            <div
              style={{
                marginTop: 14,
                fontSize: 18,
                color: "#6a1f16",
              }}
            >
              {error}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
