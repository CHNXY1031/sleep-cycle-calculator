import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Orbit, TimerReset } from "lucide-react";
import SleepCalculator from "@/components/SleepCalculator";
import { POPULAR_SLEEP_SLUGS, POPULAR_WAKE_SLUGS } from "@/lib/seo";
import { formatClock, slugToClock } from "@/lib/sleepCalculator";

function TimeLinks({ title, type, slugs }: { title: string; type: "wake" | "sleep"; slugs: string[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {slugs.map((slug) => {
          const clock = slugToClock(slug);
          if (!clock) return null;
          return (
            <Link key={slug} href={`/${type === "wake" ? "wake-up-at" : "sleep-at"}-${slug}`} className="focus-ring group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4 text-sm font-bold text-white/60 transition hover:-translate-y-0.5 hover:border-emerald/30 hover:text-white">
              {formatClock(clock)} <ArrowUpRight className="text-white/25 transition group-hover:text-emerald" size={15} aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function HomePage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "90 Minute Sleep Cycle Calculator",
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Calculate ideal bedtime and wake-up times using 90-minute sleep cycles.",
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 pb-5 pt-14 sm:px-8 lg:px-10 lg:pb-8 lg:pt-24">
        <div className="absolute right-[4%] top-10 -z-10 hidden h-[30rem] w-[30rem] animate-float rounded-full border border-aurora/15 lg:block">
          <div className="absolute inset-16 rounded-full border border-emerald/10" />
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald shadow-glow" />
        </div>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-emerald/[0.06] px-3 py-2 text-xs font-bold text-emerald"><Orbit size={15} aria-hidden="true" /> Sleep timing, precisely mapped</div>
            <h1 className="mt-7 max-w-5xl font-[family-name:var(--font-sora)] text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[5.5rem]">
              Wake up at the <span className="text-emerald">edge</span> of a sleep cycle.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
              Find your best bedtime or alarm time with 90-minute sleep cycles, including a realistic 14 minutes to fall asleep.
            </p>
          </div>
          <div className="grid gap-3 lg:col-span-3 lg:col-start-10">
            {[
              { icon: TimerReset, text: "3 calculation modes" },
              { icon: BadgeCheck, text: "5 & 6 cycle highlights" },
              { icon: Orbit, text: "Instant, private, free" },
            ].map((item) => {
              const Icon = item.icon;
              return <div key={item.text} className="flex items-center gap-3 border-l border-white/10 py-2 pl-4 text-sm text-white/50"><Icon size={17} className="text-aurora" aria-hidden="true" />{item.text}</div>;
            })}
          </div>
        </div>
      </section>

      <SleepCalculator />

      <section className="mx-auto mt-28 max-w-7xl space-y-12 px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="eyebrow">Popular sleep schedules</p>
          <h2 className="mt-3 font-[family-name:var(--font-sora)] text-3xl font-semibold tracking-tight sm:text-4xl">Quick answers for common workday alarms.</h2>
          <p className="mt-4 text-sm leading-7 text-white/50">Explore a dedicated schedule, then adjust the interactive calculator to fit your day.</p>
        </div>
        <TimeLinks title="I want to wake up at" type="wake" slugs={POPULAR_WAKE_SLUGS} />
        <TimeLinks title="I plan to sleep at" type="sleep" slugs={POPULAR_SLEEP_SLUGS} />
      </section>
    </main>
  );
}
