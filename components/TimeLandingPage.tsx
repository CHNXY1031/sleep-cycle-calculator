import Link from "next/link";
import { ArrowRight, CircleHelp, Clock4 } from "lucide-react";
import SleepCalculator from "./SleepCalculator";
import {
  calculateBedtimes,
  calculateWakeTimes,
  formatClock,
  formatDuration,
  type ClockTime,
} from "@/lib/sleepCalculator";
import { BASE_URL } from "@/lib/seo";

interface TimeLandingPageProps {
  type: "wake" | "sleep";
  clock: ClockTime;
  slug: string;
}

export default function TimeLandingPage({ type, clock, slug }: TimeLandingPageProps) {
  const displayTime = formatClock(clock);
  const isWake = type === "wake";
  const results = isWake ? calculateBedtimes(clock) : calculateWakeTimes(clock);
  const title = isWake
    ? `What time should I go to sleep to wake up at ${displayTime}?`
    : `What time should I wake up if I sleep at ${displayTime}?`;
  const answer = isWake
    ? `For five complete cycles, go to bed at ${results[1].time}. For six cycles, aim for ${results[0].time}. Both include about 14 minutes to fall asleep.`
    : `For five complete cycles, wake at ${results[1].time}. For six cycles, wake at ${results[0].time}. Both include about 14 minutes to fall asleep.`;
  const canonical = `${BASE_URL}/${isWake ? "wake-up-at" : "sleep-at"}-${slug}`;
  const faq = [
    { question: title, answer },
    { question: "Why does this calculator use 90-minute cycles?", answer: "A sleep cycle is often estimated at about 90 minutes. Timing an alarm near a cycle boundary may make waking feel easier, although real cycles naturally vary." },
    { question: "Does the calculation include time to fall asleep?", answer: "Yes. Every result includes a 14-minute average fall-asleep window before the first cycle." },
  ];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "90 Minute Sleep Cycle Calculator",
      url: canonical,
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: title,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-3 pt-14 sm:px-8 lg:grid-cols-12 lg:px-10 lg:pt-20">
        <div className="lg:col-span-9 lg:col-start-2">
          <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-full text-xs font-bold uppercase tracking-[0.16em] text-emerald">
            <Clock4 size={15} aria-hidden="true" /> 90-minute sleep planner
          </Link>
          <h1 className="mt-6 max-w-5xl font-[family-name:var(--font-sora)] text-4xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/55 sm:text-lg">{answer}</p>
        </div>
      </section>

      <SleepCalculator initialMode={type} initialTime={clock} />

      <section className="mx-auto mt-24 max-w-5xl px-5 sm:px-8">
        <p className="eyebrow">Cycle-by-cycle answer</p>
        <h2 className="mt-3 font-[family-name:var(--font-sora)] text-3xl font-semibold tracking-tight">Your complete sleep schedule</h2>
        <div className="mt-7 overflow-hidden rounded-[28px] border border-white/10">
          {results.map((result) => (
            <div key={result.cycles} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/10 bg-white/[0.025] px-5 py-5 last:border-b-0 sm:grid-cols-3 sm:px-7">
              <div><p className="font-[family-name:var(--font-sora)] text-2xl font-semibold">{result.time}</p><p className="mt-1 text-xs text-white/40">{result.cycles} complete cycles</p></div>
              <p className="hidden text-sm text-white/45 sm:block">{formatDuration(result.totalSleepMinutes)} asleep</p>
              <span className={`justify-self-end rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.13em] ${result.recommended ? "bg-emerald text-obsidian" : "border border-white/10 text-white/35"}`}>{result.recommended ? "Best choice" : "Backup"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-5xl px-5 sm:px-8">
        <div className="mb-8 flex items-center gap-3"><CircleHelp className="text-emerald" aria-hidden="true" /><h2 className="font-[family-name:var(--font-sora)] text-3xl font-semibold">Frequently asked questions</h2></div>
        <div className="space-y-3">
          {faq.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold"><span>{item.question}</span><ArrowRight className="shrink-0 text-emerald transition-transform group-open:rotate-90" size={18} aria-hidden="true" /></summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/50">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
