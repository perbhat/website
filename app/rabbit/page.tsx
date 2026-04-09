import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rabbit Reader",
  description:
    "Understand anything you read, instantly. An AI reading assistant that lives in your browser.",
};

export default function RabbitPage() {
  return (
    <div className="fixed inset-0 bg-white overflow-y-auto">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <span className="text-2xl" role="img" aria-label="rabbit">
          🐇
        </span>
        <a
          href="https://chromewebstore.google.com"
          target="_blank"
          rel="noopener"
          className="bg-[#1a1a1a] text-white text-sm font-medium px-5 py-2.5 rounded-full no-underline hover:bg-[#333] transition-colors"
        >
          add to chrome
        </a>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#999] mb-6">
          meet rabbit reader
        </p>

        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[#1a1a1a] max-w-3xl mb-8 [text-shadow:none]"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
          understand anything you read, instantly.
        </h1>

        <p
          className="text-lg leading-relaxed text-[#666] max-w-xl mb-10 [text-shadow:none]"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
          select any text on any webpage. rabbit reader explains it, summarizes
          it, or digs deeper — right in your browser. no more copy-pasting into
          chatgpt. no more switching tabs. just highlight and go.
        </p>

        <a
          href="https://chromewebstore.google.com"
          target="_blank"
          rel="noopener"
          className="bg-[#1a1a1a] text-white text-base font-medium px-8 py-3.5 rounded-full no-underline hover:bg-[#333] transition-colors mb-6"
        >
          add to chrome →
        </a>

        <p className="text-sm text-[#aaa] [text-shadow:none]">free to use · works on any webpage</p>
      </main>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#999] mb-10 text-center">
            how it works
          </p>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <span className="text-2xl font-bold text-[#ddd] [text-shadow:none] shrink-0">1</span>
              <div>
                <h3
                  className="text-lg font-semibold text-[#1a1a1a] mb-1 [text-shadow:none]"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  highlight any text
                </h3>
                <p
                  className="text-[#666] [text-shadow:none]"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  select a paragraph, a sentence, or a single word on any webpage.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <span className="text-2xl font-bold text-[#ddd] [text-shadow:none] shrink-0">2</span>
              <div>
                <h3
                  className="text-lg font-semibold text-[#1a1a1a] mb-1 [text-shadow:none]"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  rabbit reader opens beside it
                </h3>
                <p
                  className="text-[#666] [text-shadow:none]"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  a sidebar appears with ai-powered explanations, summaries, and
                  deeper research — powered by gpt and perplexity.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <span className="text-2xl font-bold text-[#ddd] [text-shadow:none] shrink-0">3</span>
              <div>
                <h3
                  className="text-lg font-semibold text-[#1a1a1a] mb-1 [text-shadow:none]"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  keep reading
                </h3>
                <p
                  className="text-[#666] [text-shadow:none]"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  no tab-switching. no copy-paste. you stay on the page and move
                  through complex material faster than ever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#999] mb-10 text-center">
            built for people who read hard things
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { who: "researchers", what: "parsing dense arxiv papers" },
              { who: "students", what: "studying textbooks and lecture notes" },
              { who: "engineers", what: "reading technical documentation" },
              { who: "analysts", what: "digesting long reports and filings" },
              { who: "lawyers", what: "reviewing contracts and case law" },
              { who: "curious people", what: "learning about anything online" },
            ].map((item) => (
              <div
                key={item.who}
                className="border border-[#eee] rounded-xl p-5 bg-white"
              >
                <p
                  className="font-semibold text-[#1a1a1a] mb-1 [text-shadow:none]"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  {item.who}
                </p>
                <p
                  className="text-sm text-[#888] [text-shadow:none]"
                  style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                  {item.what}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2
          className="text-3xl font-bold text-[#1a1a1a] mb-4 [text-shadow:none]"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
          stop struggling through complex reading.
        </h2>
        <p
          className="text-[#666] mb-8 [text-shadow:none]"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
          join researchers at meta, microsoft, and amazon.
        </p>
        <a
          href="https://chromewebstore.google.com"
          target="_blank"
          rel="noopener"
          className="bg-[#1a1a1a] text-white text-base font-medium px-8 py-3.5 rounded-full no-underline hover:bg-[#333] transition-colors"
        >
          add to chrome →
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-[#eee]">
        <p
          className="text-sm text-[#aaa] [text-shadow:none]"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
          made by{" "}
          <a
            href="/"
            className="text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            perbhat
          </a>
        </p>
      </footer>
    </div>
  );
}
