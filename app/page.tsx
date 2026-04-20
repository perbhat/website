import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}`);
  }

  return (
    <ul className="list-none p-0">
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
