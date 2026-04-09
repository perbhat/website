import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Perbhat",
  description:
    "Perbhat — builder at the intersection of AI, hardware, and software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
      <body className="min-h-screen font-[var(--font-lora)]" style={{ padding: "2em 0 4em" }}>
        <div className="w-[68%] max-w-[680px] mx-auto max-[700px]:w-[90%] max-[480px]:w-[96%]">
          <header className="text-right border-b border-[rgba(44,44,44,0.15)]" style={{ marginBottom: "2.8em", paddingBottom: "1.2em" }}>
            <h1 className="font-[var(--font-playfair)] font-normal text-[2.4em] tracking-[0.04em] text-[#2C2C2C] [text-shadow:none] max-[480px]:text-[1.9em]">
              Perbhat
            </h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
