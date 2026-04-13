import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shepherd — Perbhat",
  description:
    "Shepherd: an AI companion that lives on your Mac, sees your screen, and walks you through whatever you're working on.",
};

export default function ShepherdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
