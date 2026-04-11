import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rabbit Reader",
  description:
    "Understand anything you read, instantly. An AI reading companion that lives in your browser.",
};

export default function RabbitPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "120px 24px 80px", textAlign: "center" }}>
      {/* Label */}
      <p style={{ fontSize: 13, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 24 }}>
        Meet Rabbit Reader
      </p>

      {/* Headline */}
      <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#1a1a1a", marginBottom: 32, textShadow: "none", maxWidth: 700, margin: "0 auto 32px", fontFamily: "inherit" }}>
        understand more, not read less.
      </h1>

      {/* Description */}
      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#999", maxWidth: 640, margin: "0 auto 40px" }}>
        an ai reading companion that clarifies anything you highlight — right where you&apos;re reading. you don&apos;t want a summary. you want to finish the article and actually understand it.
      </p>

      {/* CTA row */}
      <div style={{ display: "inline-flex", alignItems: "center", borderRadius: 12, overflow: "hidden", border: "1px solid #e0e0e0", marginBottom: 20 }}>
        <input
          type="email"
          placeholder="enter your email"
          style={{ fontFamily: "inherit", fontSize: 16, padding: "16px 24px", border: "none", outline: "none", width: 260, color: "#1a1a1a", background: "#fff" }}
        />
        <button
          style={{ fontFamily: "inherit", fontSize: 16, fontWeight: 700, padding: "16px 28px", background: "#666", color: "#fff", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          add to chrome
        </button>
      </div>

      {/* Spacer */}
      <div style={{ marginBottom: 80 }} />

      {/* Use case cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 720, margin: "0 auto 80px" }}>
        {[
          "what does quantitative easing actually mean here?",
          "explain this legal clause in plain english",
          "i don't get this machine learning paragraph",
          "what's the context behind this policy change?",
          "break down this financial analysis for me",
          "help me understand this research method",
        ].map((text) => (
          <div
            key={text}
            style={{ background: "#f5f5f5", borderRadius: 12, padding: "24px 28px", fontSize: 17, lineHeight: 1.5, color: "#666", textAlign: "left" }}
          >
            &ldquo;{text}&rdquo;
          </div>
        ))}
      </div>

      {/* Footer */}
      <p style={{ fontSize: 14, color: "#ccc" }}>
        made by perbhat ♡
      </p>
    </div>
  );
}
