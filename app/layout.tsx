import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen py-8 pb-16">
        <div className="w-[68%] max-w-[680px] mx-auto max-[700px]:w-[90%] max-[480px]:w-[96%]">
          <header className="text-right mb-11 pb-5 border-b border-[rgba(44,44,44,0.15)]">
            <h1 className="font-['Playfair_Display',_'Times_New_Roman',_serif] font-normal text-[2.4em] tracking-[0.04em] text-[#2C2C2C] [text-shadow:none] max-[480px]:text-[1.9em]">
              <a href="/" className="no-underline text-inherit hover:text-inherit">
                Perbhat
              </a>
            </h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
