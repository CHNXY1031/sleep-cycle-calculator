"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  BedDouble,
  Check,
  Clipboard,
  Clock3,
  Headphones,
  Moon,
  Play,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildPlanText,
  calculateBedtimes,
  calculateSleepNow,
  calculateWakeTimes,
  FALL_ASLEEP_MINUTES,
  formatDuration,
  type ClockTime,
  type SleepMode,
  type SleepResult,
} from "@/lib/sleepCalculator";

interface SleepCalculatorProps {
  initialMode?: Exclude<SleepMode, "now">;
  initialTime?: ClockTime;
}

const modes: Array<{
  id: Exclude<SleepMode, "now">;
  label: string;
  shortLabel: string;
  icon: typeof AlarmClock;
}> = [
  { id: "wake", label: "I want to wake up at…", shortLabel: "Wake at", icon: AlarmClock },
  { id: "sleep", label: "I plan to go to sleep at…", shortLabel: "Sleep at", icon: BedDouble },
];

function resultsFor(mode: SleepMode, clock: ClockTime): SleepResult[] {
  if (mode === "wake") return calculateBedtimes(clock);
  if (mode === "sleep") return calculateWakeTimes(clock);
  return calculateSleepNow();
}

export default function SleepCalculator({
  initialMode = "wake",
  initialTime = { hour: 6, minute: 30 },
}: SleepCalculatorProps) {
  const [mode, setMode] = useState<SleepMode>(initialMode);
  const [clock, setClock] = useState<ClockTime>(initialTime);
  const [results, setResults] = useState<SleepResult[]>(() => resultsFor(initialMode, initialTime));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (mode !== "now") setResults(resultsFor(mode, clock));
  }, [clock, mode]);

  const hour12 = clock.hour % 12 || 12;
  const period = clock.hour >= 12 ? "PM" : "AM";
  const minuteOptions = useMemo(() => [0, 15, 30, 45], []);

  function chooseMode(nextMode: Exclude<SleepMode, "now">) {
    setMode(nextMode);
    setCopied(false);
  }

  function calculateNow() {
    setMode("now");
    setResults(calculateSleepNow());
    setCopied(false);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateHour(value: number) {
    const nextHour = (value % 12) + (period === "PM" ? 12 : 0);
    setClock((current) => ({ ...current, hour: nextHour }));
  }

  function updatePeriod(nextPeriod: "AM" | "PM") {
    setClock((current) => ({
      ...current,
      hour: (current.hour % 12) + (nextPeriod === "PM" ? 12 : 0),
    }));
  }

  async function copyPlan() {
    await navigator.clipboard.writeText(buildPlanText(mode, results));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  const actionLabel = mode === "wake" ? "Go to bed at" : "Wake up at";

  return (
    <section id="calculator" className="relative mx-auto mt-10 max-w-7xl scroll-mt-6 px-5 sm:px-8 lg:px-10">
      <div className="absolute -left-24 top-48 -z-10 h-72 w-72 rounded-full bg-emerald/5 blur-3xl" />
      <button
        type="button"
        onClick={calculateNow}
        className="focus-ring group relative mb-5 flex w-full items-center justify-between overflow-hidden rounded-[24px] border border-emerald/35 bg-emerald px-5 py-5 text-left text-obsidian shadow-glow transition hover:-translate-y-0.5 hover:bg-[#75f0c6] sm:px-7"
      >
        <span className="absolute right-20 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full border border-obsidian/10 transition-transform group-hover:scale-125" />
        <span className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-obsidian text-emerald">
            <Moon size={21} aria-hidden="true" />
          </span>
          <span>
            <span className="block font-[family-name:var(--font-sora)] text-lg font-extrabold sm:text-2xl">😴 Calculate for NOW</span>
            <span className="mt-0.5 block text-xs font-semibold text-obsidian/65 sm:text-sm">If I go to bed right now</span>
          </span>
        </span>
        <Play className="relative shrink-0 transition-transform group-hover:translate-x-1" size={24} fill="currentColor" aria-hidden="true" />
      </button>

      <div className="grid items-start gap-5 lg:grid-cols-12">
        <div className="glass-panel relative overflow-hidden rounded-[28px] p-5 sm:p-7 lg:col-span-5 lg:rounded-[34px] lg:p-8">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-aurora/20" />
          <div className="absolute -right-9 -top-9 h-32 w-32 rounded-full border border-aurora/10" />
          <p className="eyebrow">Set your target</p>
          <h2 className="mt-3 max-w-md font-[family-name:var(--font-sora)] text-2xl font-semibold tracking-tight sm:text-3xl">
            Plan around a complete sleep cycle.
          </h2>

          <div className="mt-7 grid grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1.5">
            {modes.map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseMode(item.id)}
                  className={cn(
                    "focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 text-xs font-bold transition sm:text-sm",
                    active ? "bg-white/10 text-white shadow-inner" : "text-white/45 hover:text-white/80",
                  )}
                  aria-pressed={active}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            {mode === "now" ? (
              <div className="rounded-[24px] border border-emerald/20 bg-emerald/[0.07] p-6">
                <Clock3 className="text-emerald" size={26} aria-hidden="true" />
                <p className="mt-4 font-[family-name:var(--font-sora)] text-xl font-semibold">Calculated from this moment</p>
                <p className="mt-2 text-sm leading-6 text-white/55">Tap the green button again anytime to refresh the current time.</p>
              </div>
            ) : (
              <>
                <label className="text-sm font-semibold text-white/60" htmlFor="sleep-hour">
                  {mode === "wake" ? "Target wake-up time" : "Planned bedtime"}
                </label>
                <div className="mt-3 grid grid-cols-[1fr_auto_1fr_1fr] items-center gap-2">
                  <select
                    id="sleep-hour"
                    value={hour12}
                    onChange={(event) => updateHour(Number(event.target.value))}
                    className="focus-ring h-16 appearance-none rounded-2xl border border-white/10 bg-midnight/80 px-4 text-center font-[family-name:var(--font-sora)] text-2xl font-bold text-white"
                    aria-label="Hour"
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => <option key={hour}>{hour}</option>)}
                  </select>
                  <span className="text-2xl font-bold text-white/30">:</span>
                  <select
                    value={clock.minute}
                    onChange={(event) => setClock((current) => ({ ...current, minute: Number(event.target.value) }))}
                    className="focus-ring h-16 appearance-none rounded-2xl border border-white/10 bg-midnight/80 px-4 text-center font-[family-name:var(--font-sora)] text-2xl font-bold text-white"
                    aria-label="Minute"
                  >
                    {minuteOptions.map((minute) => <option key={minute} value={minute}>{minute.toString().padStart(2, "0")}</option>)}
                  </select>
                  <select
                    value={period}
                    onChange={(event) => updatePeriod(event.target.value as "AM" | "PM")}
                    className="focus-ring h-16 appearance-none rounded-2xl border border-white/10 bg-midnight/80 px-2 text-center text-base font-extrabold text-emerald"
                    aria-label="AM or PM"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-white/45">
            <ShieldCheck className="mt-0.5 shrink-0 text-emerald" size={17} aria-hidden="true" />
            <p>Includes an average {FALL_ASLEEP_MINUTES}-minute wind-down before the first 90-minute cycle begins.</p>
          </div>
        </div>

        <div id="results" className="scroll-mt-6 lg:col-span-7 lg:mt-9">
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <div>
              <p className="eyebrow">Your sleep window</p>
              <h2 className="mt-2 font-[family-name:var(--font-sora)] text-2xl font-semibold">{actionLabel}</h2>
            </div>
            <button
              type="button"
              onClick={copyPlan}
              className="focus-ring flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/60 transition hover:border-emerald/35 hover:text-emerald sm:px-4"
            >
              {copied ? <Check size={15} aria-hidden="true" /> : <Clipboard size={15} aria-hidden="true" />}
              {copied ? "Copied" : "Copy plan"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((result, index) => (
              <article
                key={`${result.cycles}-${result.time}`}
                className={cn(
                  "animate-rise relative overflow-hidden rounded-[24px] border p-5 sm:p-6",
                  result.cycles === 5
                    ? "border-emerald/40 bg-emerald/[0.09] shadow-glow sm:-translate-y-2"
                    : result.cycles === 6
                      ? "border-aurora/35 bg-aurora/[0.08] shadow-violet"
                      : "border-white/10 bg-white/[0.035]",
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {result.recommended && (
                  <span className={cn("absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em]", result.cycles === 5 ? "bg-emerald text-obsidian" : "bg-aurora text-white")}>Recommended</span>
                )}
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">{result.cycles} cycles · {formatDuration(result.totalSleepMinutes)}</p>
                <p className="mt-4 font-[family-name:var(--font-sora)] text-4xl font-semibold tracking-[-0.06em] sm:text-[2.65rem]">{result.time}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/50">
                  {result.cycles === 5 ? <Sparkles size={15} className="text-emerald" aria-hidden="true" /> : result.cycles === 6 ? <SunMedium size={15} className="text-aurora" aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
                  {result.label}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-12">
        <article className="glass-panel rounded-[28px] p-6 sm:p-8 lg:col-span-7">
          <p className="eyebrow">Avoid sleep inertia</p>
          <h3 className="mt-3 font-[family-name:var(--font-sora)] text-2xl font-semibold">Wake between cycles, not in the middle of deep sleep.</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
            Sleep inertia is the foggy, heavy feeling after waking. A cycle estimate can reduce the chance of an alarm interrupting deeper sleep, but cycle length varies from person to person and across the night.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Get daylight soon after waking", "Drink water before caffeine", "Keep wake time consistent"].map((tip, index) => (
              <div key={tip} className="rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-6 text-white/65">
                <span className="mb-3 grid h-7 w-7 place-items-center rounded-full bg-emerald/10 text-xs font-extrabold text-emerald">0{index + 1}</span>
                {tip}
              </div>
            ))}
          </div>
        </article>

        <aside className="relative overflow-hidden rounded-[28px] border border-aurora/25 bg-aurora/[0.07] p-6 sm:p-8 lg:col-span-5 lg:translate-y-8">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-aurora/20" />
          <p className="eyebrow text-[#bca7ff]">Partner picks</p>
          <h3 className="mt-3 font-[family-name:var(--font-sora)] text-2xl font-semibold">🌙 Improve Your Deep Sleep</h3>
          <div className="mt-6 space-y-3">
            {[
              { icon: Moon, title: "Sleep & meditation app", note: "Guided wind-down routines" },
              { icon: Headphones, title: "Noise-reducing earplugs", note: "Comfort for side sleepers" },
              { icon: Waves, title: "White noise tools", note: "Consistent overnight sound" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-obsidian/40 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aurora/15 text-[#bca7ff]"><Icon size={19} aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{item.title}</span><span className="mt-0.5 block text-xs text-white/40">{item.note}</span></span>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/30">Coming soon</span>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[11px] leading-5 text-white/30">Reserved for independently reviewed affiliate recommendations.</p>
        </aside>
      </div>
    </section>
  );
}
