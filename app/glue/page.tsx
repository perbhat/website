import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Glue — Perbhat",
  description: "Glue: a native macOS AI client that unifies models, tools, and workflows.",
};

export default function GluePage() {
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

      <h2 className="font-['Playfair_Display',_'Times_New_Roman',_serif] font-normal text-[1.8em] tracking-[0.02em] text-[#2C2C2C] [text-shadow:none] mb-6">
        Glue
      </h2>

      <section className="mb-8">
        <p className="mb-4 leading-[1.7]">
          Glue is a native macOS AI client that unifies multiple language models,
          tools, and workflows into a single interface. Instead of switching
          between ChatGPT, Claude, and a dozen browser tabs, Glue gives you one
          place to work with any model and wire it into the tools you already use.
        </p>
      </section>

      <h3 className="font-['Playfair_Display',_'Times_New_Roman',_serif] font-normal text-[1em] tracking-[0.08em] uppercase text-[#888] mb-4 mt-10 [text-shadow:none]">
        What it does
      </h3>
      <ul className="list-none p-0">
        <li className="mb-3 pl-4 border-l-2 border-[rgba(44,44,44,0.15)]">
          Multi-model support — talk to GPT-4, Claude, Gemini, and local models
          from the same conversation.
        </li>
        <li className="mb-3 pl-4 border-l-2 border-[rgba(44,44,44,0.15)]">
          Tool integrations — connect your filesystem, browser, terminal, and
          APIs so the model can act on your behalf.
        </li>
        <li className="mb-3 pl-4 border-l-2 border-[rgba(44,44,44,0.15)]">
          Native macOS — built with Swift and AppKit for a fast, responsive
          experience that feels like it belongs on your machine.
        </li>
      </ul>

      <h3 className="font-['Playfair_Display',_'Times_New_Roman',_serif] font-normal text-[1em] tracking-[0.08em] uppercase text-[#888] mb-4 mt-10 [text-shadow:none]">
        Technical details
      </h3>
      <p className="mb-4 leading-[1.7]">
        Built with Swift and AppKit. Uses a plugin architecture for model
        providers and tool integrations, so adding a new model or tool is just
        writing a conforming module. Conversations are stored locally as
        structured data — nothing leaves your machine unless you send it to an
        API.
      </p>

      <h3 className="font-['Playfair_Display',_'Times_New_Roman',_serif] font-normal text-[1em] tracking-[0.08em] uppercase text-[#888] mb-4 mt-10 [text-shadow:none]">
        Links
      </h3>
      <ul className="list-none p-0">
        <li className="mb-2">
          <a
            href="https://github.com/perbhat/glue"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
        </li>
      </ul>
    </>
  );
}
