import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-center mt-16">
      <pre className="text-[0.55em] leading-[1.15] tracking-[0.05em] text-[#d4727a] mb-8 [text-shadow:none]">{`
        ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
      ⬜⬜⬜⬜🟪🟪🟪🟪🟪🟪🟪⬜⬜⬜⬜
      ⬜⬜⬜🟪🟫🟫🟫🟫🟫🟫🟫🟪⬜⬜⬜
      ⬜⬜🟪🟫🟫🟫🟫🟫🟫🟫🟫🟫🟪⬜⬜
      ⬜🟪🟫🟫⬛⬜🟫🟫🟫⬛⬜🟫🟫🟪⬜
      ⬜🟪🟫🟫⬛⬛🟫🟫🟫⬛⬛🟫🟫🟪⬜
      ⬜🟪🟫🟫🟫🟫🟫🩷🟫🟫🟫🟫🟫🟪⬜
      ⬜🟪🟫🟫🟫🟫🩷🩷🩷🟫🟫🟫🟫🟪⬜
      ⬜🟪🟫🩷🟫🟫🟫🟫🟫🟫🟫🩷🟫🟪⬜
      ⬜⬜🟪🟫🟫🩷🩷🩷🩷🩷🟫🟫🟪⬜⬜
      ⬜⬜⬜🟪🟫🟫🟫🟫🟫🟫🟫🟪⬜⬜⬜
      ⬜⬜⬜⬜🟪🟪🟪🟪🟪🟪🟪⬜⬜⬜⬜
      `}</pre>

      <p className="text-xl mb-2 font-['Playfair_Display',_'Times_New_Roman',_serif]">
        You found the dreamy pig!
      </p>
      <p className="text-[#888] mb-8">
        This page doesn't exist though.
      </p>
      <Link
        href="/"
        className="text-sm tracking-[0.04em]"
      >
        ← Go home
      </Link>
    </div>
  );
}
