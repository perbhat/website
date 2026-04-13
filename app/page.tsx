import Link from "next/link";

export default function Home() {
  return (
    <ul className="list-none p-0">
      <li className="mb-[0.4em]">
        <Link href="/pico">Pico</Link>
      </li>
      <li className="mb-[0.4em]">
        <a href="https://x.com/perbhatk" target="_blank" rel="noopener">
          Twitter
        </a>
      </li>
      <li className="mb-[0.4em]">
        <a href="https://linkedin.com/in/perbhat" target="_blank" rel="noopener">
          LinkedIn
        </a>
      </li>
    </ul>
  );
}
