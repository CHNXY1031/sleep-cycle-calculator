import Link from "next/link";
import { ArrowLeft, MoonStar } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[65vh] max-w-3xl content-center px-5 py-20">
      <MoonStar className="text-emerald" size={38} aria-hidden="true" />
      <p className="eyebrow mt-6">404 · Off cycle</p>
      <h1 className="mt-3 font-[family-name:var(--font-sora)] text-5xl font-semibold tracking-tight">This sleep time drifted away.</h1>
      <p className="mt-5 text-white/50">Return to the calculator and choose another time.</p>
      <Link href="/" className="focus-ring mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-emerald px-5 py-3 text-sm font-extrabold text-obsidian"><ArrowLeft size={17} aria-hidden="true" /> Back to calculator</Link>
    </main>
  );
}
