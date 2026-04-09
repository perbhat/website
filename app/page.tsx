import Link from "next/link";

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-['Playfair_Display',_'Times_New_Roman',_serif] font-normal text-[1em] tracking-[0.08em] uppercase text-[#888] mb-4 mt-10 [text-shadow:none]">
    {children}
  </h2>
);

export default function Home() {
  return (
    <>
      <section className="mb-2">
        <p className="mb-4 leading-[1.7]">
          I build things at the intersection of AI, hardware, and software. My
          current focus is developing a deep understanding of large language
          models — reading papers, training models, and figuring out what's
          actually happening inside them.
        </p>
        <p className="mb-4 leading-[1.7]">
          I've shipped an iOS app that lets friends share sleep data through
          ambient visualizations, written firmware for e-paper display readers,
          and built a Raspberry Pi harness for agentic video color grading. When
          something interests me, I build toward it.
        </p>
        <p className="mb-4 leading-[1.7]">
          Previously: web apps in React and Flask, multiplayer games over raw
          sockets, and a paper trading platform to learn how markets work.
        </p>
      </section>

      <SectionHeading>Selected work</SectionHeading>
      <ul className="list-none p-0">
        <li className="mb-3">
          <Link href="/glue">Glue</Link> — a native macOS
          AI client that unifies models, tools, and workflows in one interface.
        </li>
        <li className="mb-3">
          <Link href="/rabbit">Rabbit</Link> — a
          multiplayer game built over raw sockets.
        </li>
        <li className="mb-3">
          <a
            href="https://github.com/perbhat/DeepLearning"
            target="_blank"
            rel="noopener"
          >
            Deep Learning
          </a>{" "}
          — building intuition for LLMs, RNNs, and stable diffusion from the
          ground up. The goal is to read papers and build new things.
        </li>
        <li className="mb-3">
          <a
            href="https://github.com/perbhat/apnea"
            target="_blank"
            rel="noopener"
          >
            Apnea
          </a>{" "}
          — an iOS app for sharing HealthKit sleep data with friends through
          sleep circles. Swift.
        </li>
        <li className="mb-3">
          <a
            href="https://github.com/perbhat/agentic-color-grader"
            target="_blank"
            rel="noopener"
          >
            Agentic Color Grader
          </a>{" "}
          — a Raspberry Pi harness for color grading multi-clip video with an AI
          in the loop. TypeScript.
        </li>
        <li className="mb-3">
          <a
            href="https://github.com/perbhat/crosspoint-reader"
            target="_blank"
            rel="noopener"
          >
            Crosspoint Reader
          </a>{" "}
          — firmware for the Xteink X4 e-paper display reader. C.
        </li>
        <li className="mb-3">
          <a
            href="https://github.com/perbhat/PaperBull"
            target="_blank"
            rel="noopener"
          >
            PaperBull
          </a>{" "}
          — an online paper trading platform for learning markets without
          risking real money. React &amp; Flask.
        </li>
      </ul>

      <SectionHeading>Elsewhere</SectionHeading>
      <ul className="list-none p-0">
        <li className="mb-2">
          <a
            href="https://github.com/perbhat"
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
