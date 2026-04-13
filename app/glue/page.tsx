"use client";

import { useState } from "react";

const DOWNLOAD_URL =
  "https://github.com/perbhat/website/releases/download/glue-v1.0/Glue.Canvas.dmg";
const SUPABASE_URL = "https://jmxilnzsdszeveuxclhv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteGlsbnpzZHN6ZXZldXhjbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NjcwNjYsImV4cCI6MjA4NDU0MzA2Nn0.KXc08oE77tgVjtjEcfB_FICIEvjpNOsDjCgGbLCctXw";

export default function GluePage() {
  const [email, setEmail] = useState("");
  const [building, setBuilding] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleGetStarted() {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, role: `glue: ${building}` }),
      });
    } catch {
      // still allow download
    }
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto z-50">
      <div className="max-w-[1200px] mx-auto px-8 py-20 max-[768px]:px-6">
        <div className="flex items-center gap-16 max-[768px]:flex-col">
          {/* Left: text + form */}
          <div className="flex-1 min-w-0 text-left">
            <h2 className="font-[var(--font-playfair)] font-normal text-[0.85em] tracking-[0.06em] text-[#999] [text-shadow:none] mb-3 uppercase">
              Meet Glue
            </h2>

            <p className="text-[#888] leading-[1.6] mb-6 text-[1em]">
              For claude designers, engineers, and code maximalists who spend a
              lot of time in Figma
            </p>

            <p className="text-[#2C2C2C] leading-[1.6] mb-6 text-[1.35em]">
              Glue is the fastest way to design user interfaces. It&apos;s what
              Figma could be if it was made today instead of 14 years ago.
            </p>

            <p className="text-[#555] leading-[1.7] mb-10 text-[1.05em]">
              Unlike Figma, your designs are backed by code, and your agent can
              work with you to generate design systems, create variants, and
              implement changes in code fast.
            </p>

            {!submitted ? (
              <div className="flex flex-col gap-4 max-w-[360px]">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#ddd] rounded-lg text-[0.95em] outline-none focus:border-[#999] transition-colors font-[var(--font-lora)] text-[#2C2C2C]"
                />
                <input
                  type="text"
                  placeholder="What are you going to build?"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full px-4 py-3 border border-[#ddd] rounded-lg text-[0.95em] outline-none focus:border-[#999] transition-colors font-[var(--font-lora)] text-[#2C2C2C]"
                />
                <button
                  onClick={handleGetStarted}
                  className={`w-full px-6 py-3 rounded-lg text-[0.95em] font-[var(--font-lora)] whitespace-nowrap transition-colors ${
                    isValid
                      ? "bg-[#1a1a1a] text-white cursor-pointer hover:bg-[#333]"
                      : "bg-[#ccc] text-white cursor-not-allowed"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-w-[360px]">
                <a
                  href={DOWNLOAD_URL}
                  className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-3 bg-[#1a1a1a] rounded-lg text-[0.95em] font-[var(--font-lora)] whitespace-nowrap transition-colors hover:bg-[#333]"
                  style={{ textDecoration: "none", color: "white" }}
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
                </a>

                <a
                  href="https://drive.google.com/drive/folders/1hJjcCDtFPvV_Ft0FhjofhCvJIOnTWdrT?usp=sharing"
                  target="_blank"
                  rel="noopener"
                  className="w-full px-6 py-3 border border-[#ddd] rounded-lg text-[0.95em] font-[var(--font-lora)] transition-colors hover:border-[#999] text-center"
                  style={{ textDecoration: "none", color: "#2C2C2C" }}
                >
                  Support &amp; Docs
                </a>

                <a
                  href="https://cal.com/perbhat/chat"
                  target="_blank"
                  rel="noopener"
                  className="w-full px-6 py-3 border border-[#ddd] rounded-lg text-[0.95em] font-[var(--font-lora)] transition-colors hover:border-[#999] text-center"
                  style={{ textDecoration: "none", color: "#2C2C2C" }}
                >
                  Book an onboarding call
                </a>
              </div>
            )}
          </div>

          {/* Right: video */}
          <div className="flex-1 min-w-0 rounded-xl overflow-hidden">
            <video
              src="/glue-demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
