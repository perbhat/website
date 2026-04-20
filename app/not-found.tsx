"use client";

import Link from "next/link";
import { useState } from "react";

function PixelPig({ onClick }: { onClick?: () => void }) {
  // 16x16 pixel grid — each 1 is filled (pig body), 2 is eye, 3 is snout, 0 is empty
  const grid = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
    [0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,2,2,1,1,1,1,1,2,2,1,1,0,0],
    [0,1,1,2,2,1,1,1,1,1,2,2,1,1,0,0],
    [0,1,1,1,1,1,3,3,3,3,1,1,1,1,0,0],
    [0,1,1,1,1,1,3,1,1,3,1,1,1,1,0,0],
    [0,1,1,1,1,1,3,3,3,3,1,1,1,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  const colors: Record<number, string> = {
    1: "#E8A0BF",
    2: "#2C2C2C",
    3: "#D4727A",
  };

  const px = 8;

  return (
    <svg
      width={16 * px}
      height={16 * px}
      viewBox={`0 0 ${16 * px} ${16 * px}`}
      xmlns="http://www.w3.org/2000/svg"
      className="mb-8 cursor-pointer"
      style={{ imageRendering: "pixelated" }}
      onClick={onClick}
    >
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * px}
              y={y * px}
              width={px}
              height={px}
              fill={colors[cell]}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function NotFound() {
  const [oinkCount, setOinkCount] = useState(0);

  return (
    <div className="flex flex-col items-center text-center mt-16">
      <div className="relative">
        {oinkCount > 0 && (
          <div
            key={oinkCount}
            className="absolute -top-2 left-full ml-2 px-3 py-1 bg-white border border-[#E8A0BF] rounded-2xl text-sm text-[#2C2C2C] shadow-sm whitespace-nowrap oink-bubble"
          >
            oink
          </div>
        )}
        <PixelPig onClick={() => setOinkCount((c) => c + 1)} />
      </div>

      <p className="text-xl mb-2 font-[var(--font-playfair)]">
        You&apos;ve found Piggy.
      </p>
      <p className="text-[#888] mb-8">
        This page doesn&apos;t exist yet, but it might soon. Stay tuned!
      </p>
      <Link href="/" className="text-sm tracking-[0.04em]">
        ← Go home
      </Link>
      <style>{`
        @keyframes oinkPop {
          0% { opacity: 0; transform: scale(0.6) translateY(4px); }
          40% { opacity: 1; transform: scale(1.05) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .oink-bubble {
          animation: oinkPop 200ms ease-out;
        }
      `}</style>
    </div>
  );
}
