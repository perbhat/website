import type { Metadata } from "next";
import { VT323, Press_Start_2P } from "next/font/google";

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press",
});

export const metadata: Metadata = {
  title: "Transcribe — Perbhat",
  description:
    "Upload a voice memo and get a speaker-diarized transcript. Retro, fast, yours.",
};

export default function TranscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${vt323.variable} ${pressStart.variable}`}>{children}</div>
  );
}
