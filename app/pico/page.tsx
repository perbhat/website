import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pico — Perbhat",
  description: "Pico: a Claude harness for color correction.",
};

export default function PicoPage() {
  return (
    <>
      <div className="mb-8">
        <Link
          href="/"
          className="text-[#888] text-sm tracking-[0.04em] hover:text-[#2C2C2C]"
        >
          ← Back
        </Link>
      </div>

      <h2 className="font-[var(--font-playfair)] font-normal text-[1.8em] tracking-[0.02em] text-[#2C2C2C] [text-shadow:none] mb-6">
        Pico
      </h2>

      <section className="mb-8">
        <p className="mb-4 leading-[1.7]">
          <a href="https://github.com/perbhat/agentic-color-grader" target="_blank" rel="noopener">Pico</a> is a Claude harness for color correction.
        </p>
        <p className="mb-4 leading-[1.7]">
          Instead of empowering creators to realize their visions, most AI tools
          focus on automating production end-to-end.
        </p>
        <p className="mb-4 leading-[1.7]">
          The creative act is not something to be automated away. It is a moment
          of expression, where artists move from an idea in their heads to a
          story on a screen. Instead of automating away their agency, we should
          build tools to empower creators.
        </p>
      </section>

      <section className="mb-8">
        <p className="mb-4 leading-[1.7]">
          Pico is one opinionated example. Pico is not an AI video editor. Pico is
          a color corrector. Pico does not grade — you do.
        </p>
        <p className="mb-4 leading-[1.7]">
          Pico merely removes the tedium of standardizing your footage from S-Log3
          to a Rec.709 color space.
        </p>
        <p className="mb-4 leading-[1.7]">
          Pico is for you. Try it{" "}
          <a
            href="https://github.com/perbhat/agentic-color-grader"
            target="_blank"
            rel="noopener"
          >
            here
          </a>
          .
        </p>
      </section>
    </>
  );
}
