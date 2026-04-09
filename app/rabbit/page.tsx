import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rabbit — Perbhat",
  description: "Rabbit: a multiplayer game built over raw sockets.",
};

export default function RabbitPage() {
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
        Rabbit
      </h2>

      <section className="mb-8">
        <p className="mb-4 leading-[1.7]">
          Rabbit is a multiplayer game built over raw sockets. The goal was to
          understand networked game architecture from the ground up — no game
          engine, no framework, just TCP/UDP and a game loop.
        </p>
      </section>

      <h3 className="font-[var(--font-playfair)] font-normal text-[1em] tracking-[0.08em] uppercase text-[#888] mb-4 mt-10 [text-shadow:none]">
        What it does
      </h3>
      <ul className="list-none p-0">
        <li className="mb-3 pl-4 border-l-2 border-[rgba(44,44,44,0.15)]">
          Real-time multiplayer — players connect to a shared game server and
          interact in the same world with low-latency state sync.
        </li>
        <li className="mb-3 pl-4 border-l-2 border-[rgba(44,44,44,0.15)]">
          Raw socket networking — no WebSocket libraries or game networking
          frameworks. Direct TCP/UDP socket programming for full control over the
          protocol.
        </li>
        <li className="mb-3 pl-4 border-l-2 border-[rgba(44,44,44,0.15)]">
          Client-server architecture — authoritative server handles game state
          while clients handle rendering and input prediction.
        </li>
      </ul>

      <h3 className="font-[var(--font-playfair)] font-normal text-[1em] tracking-[0.08em] uppercase text-[#888] mb-4 mt-10 [text-shadow:none]">
        Technical details
      </h3>
      <p className="mb-4 leading-[1.7]">
        The server manages an authoritative game loop and broadcasts state
        updates to connected clients. Clients use input prediction and
        interpolation to keep the experience smooth despite network latency.
        Built to learn the fundamentals of real-time networked systems.
      </p>

      <h3 className="font-[var(--font-playfair)] font-normal text-[1em] tracking-[0.08em] uppercase text-[#888] mb-4 mt-10 [text-shadow:none]">
        Links
      </h3>
      <ul className="list-none p-0">
        <li className="mb-2">
          <a
            href="https://github.com/perbhat/rabbit"
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
