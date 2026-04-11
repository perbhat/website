import { Lato } from "next/font/google";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function RabbitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={lato.className}
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        color: "#1a1a1a",
        overflow: "auto",
        fontFamily: "inherit",
        fontSize: "16px",
        lineHeight: "1.6",
        textShadow: "none",
      }}
    >
      <style>{`
        .rabbit-page, .rabbit-page * {
          font-family: inherit !important;
        }
        .rabbit-page a {
          color: inherit !important;
          text-decoration: none !important;
        }
      `}</style>
      <div className="rabbit-page">{children}</div>
    </div>
  );
}
