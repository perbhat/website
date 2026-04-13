import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shepherd — Perbhat",
  description:
    "Shepherd: an AI companion that lives on your Mac, sees your screen, and walks you through whatever you're working on.",
};

export default function ShepherdPage() {
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
            className="px-4 py-3 border border-[#ddd] rounded-lg text-[0.95em] w-[240px] outline-none focus:border-[#999] transition-colors font-[var(--font-lora)] text-[#2C2C2C]"
          />
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#888] text-white rounded-lg text-[0.95em] font-[var(--font-lora)] cursor-pointer hover:bg-[#777] transition-colors whitespace-nowrap"
            onClick={() => window.location.href = "https://github.com/perbhat/website/releases/download/shepherd-v1.0/Shepherd.dmg"}
          >
            download for mac
            <span className="text-[1.1em]"></span>
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
