"use client";

import { useState } from "react";

const DOWNLOAD_URL =
  "https://github.com/perbhat/website/releases/download/shepherd-v1.0/Shepherd.dmg";
const SUPABASE_URL = "https://jmxilnzsdszeveuxclhv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteGlsbnpzZHN6ZXZldXhjbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NjcwNjYsImV4cCI6MjA4NDU0MzA2Nn0.KXc08oE77tgVjtjEcfB_FICIEvjpNOsDjCgGbLCctXw";

export default function ShepherdPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleDownload() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, role: "shepherd" }),
      });
    } catch {
      // still allow download even if save fails
    }
    window.location.href = DOWNLOAD_URL;
    setSubmitting(false);
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center max-w-[520px] px-6">
        <h2 className="font-[var(--font-playfair)] font-normal text-[0.85em] tracking-[0.06em] text-[#999] [text-shadow:none] mb-3 uppercase">
          Meet Shepherd
        </h2>

        <p className="text-[#2C2C2C] leading-[1.6] mb-10 text-[1.45em]">
          An AI companion that lives on your Mac, sees your screen, and walks
          you through whatever you&apos;re working on.
        </p>

        <div className="flex items-center gap-3 justify-center max-[520px]:flex-col">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDownload()}
            className="px-4 py-3 border border-[#ddd] rounded-lg text-[0.95em] w-[240px] outline-none focus:border-[#999] transition-colors font-[var(--font-lora)] text-[#2C2C2C]"
          />
          <button
            onClick={handleDownload}
            className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-[0.95em] font-[var(--font-lora)] whitespace-nowrap transition-colors ${
              isValid
                ? "bg-[#1a1a1a] text-white cursor-pointer hover:bg-[#333]"
                : "bg-[#ccc] text-white cursor-not-allowed"
            }`}
          >
            <svg
              width="16"
              height="20"
              viewBox="0 0 814 1000"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.5-105.3-208.5-105.3-329 0-193.1 125.7-295.6 249.3-295.6 65.8 0 120.8 43.4 162.1 43.4 39.3 0 100.5-46 175.4-46 28.3 0 130.1 2.6 197.1 99.6zm-234.7-182.6c31.2-36.9 53.4-88.1 53.4-139.3 0-7.1-.6-14.3-1.9-20.1-50.9 1.9-110.6 33.9-146.9 75.8-28.3 32-56.1 83.2-56.1 135.1 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.7 0 103-30.6 140-71z" />
            </svg>
            Download for Mac
          </button>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 max-w-[520px]">
          {[
            "How do I add a track in GarageBand?",
            "How can I adjust saturation in Lightroom?",
            "How should I respond to this message?",
          ].map((q) => (
            <p
              key={q}
              className="text-[#999] text-[0.92em] italic font-[var(--font-lora)]"
            >
              &ldquo;{q}&rdquo;
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
