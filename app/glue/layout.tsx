import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glue — Perbhat",
  description:
    "Glue: the fastest way to design user interfaces. What Figma could be if it was made today.",
};

export default function GlueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
