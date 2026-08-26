export const SLEEP_CYCLE_MINUTES = 90;
export const FALL_ASLEEP_MINUTES = 14;
export const CYCLE_OPTIONS = [6, 5, 4, 3] as const;

export type SleepMode = "now" | "wake" | "sleep";
export type CycleCount = (typeof CYCLE_OPTIONS)[number];

export interface ClockTime {
  hour: number;
  minute: number;
}

export interface SleepResult {
  cycles: CycleCount;
  time: string;
  totalSleepMinutes: number;
  recommended: boolean;
  label: string;
}

const pad = (value: number) => value.toString().padStart(2, "0");

export function normalizeMinutes(totalMinutes: number): number {
  return ((totalMinutes % 1440) + 1440) % 1440;
}

export function clockToMinutes(clock: ClockTime): number {
  return normalizeMinutes(clock.hour * 60 + clock.minute);
}

export function minutesToClock(totalMinutes: number): ClockTime {
  const normalized = normalizeMinutes(totalMinutes);
  return { hour: Math.floor(normalized / 60), minute: normalized % 60 };
}

export function formatClock(clock: ClockTime): string {
  const period = clock.hour >= 12 ? "PM" : "AM";
  const hour12 = clock.hour % 12 || 12;
  return `${hour12}:${pad(clock.minute)} ${period}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function resultFor(cycles: CycleCount, totalMinutes: number): SleepResult {
  return {
    cycles,
    time: formatClock(minutesToClock(totalMinutes)),
    totalSleepMinutes: cycles * SLEEP_CYCLE_MINUTES,
    recommended: cycles >= 5,
    label: cycles === 5 ? "Sweet spot" : cycles === 6 ? "Full recovery" : "Short night",
  };
}

export function calculateWakeTimes(bedtime: ClockTime): SleepResult[] {
  const base = clockToMinutes(bedtime) + FALL_ASLEEP_MINUTES;
  return CYCLE_OPTIONS.map((cycles) =>
    resultFor(cycles, base + cycles * SLEEP_CYCLE_MINUTES),
  );
}

export function calculateBedtimes(wakeTime: ClockTime): SleepResult[] {
  const target = clockToMinutes(wakeTime);
  return CYCLE_OPTIONS.map((cycles) =>
    resultFor(cycles, target - cycles * SLEEP_CYCLE_MINUTES - FALL_ASLEEP_MINUTES),
  );
}

export function calculateSleepNow(now = new Date()): SleepResult[] {
  return calculateWakeTimes({ hour: now.getHours(), minute: now.getMinutes() });
}

export function parseDisplayTime(value: string): ClockTime | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
  const period = match[3].toUpperCase();
  return { hour: (hour % 12) + (period === "PM" ? 12 : 0), minute };
}

export function slugToClock(slug: string): ClockTime | null {
  const match = slug.match(/^(\d{1,2})-(\d{2})-(am|pm)$/);
  if (!match) return null;
  return parseDisplayTime(`${match[1]}:${match[2]} ${match[3]}`);
}

export function clockToSlug(clock: ClockTime): string {
  return formatClock(clock).toLowerCase().replace(":", "-").replace(" ", "-");
}

export function generateTimeSlugs(intervalMinutes = 15): string[] {
  const slugs: string[] = [];
  for (let minutes = 0; minutes < 1440; minutes += intervalMinutes) {
    slugs.push(clockToSlug(minutesToClock(minutes)));
  }
  return slugs;
}

export function buildPlanText(mode: SleepMode, results: SleepResult[]): string {
  const action = mode === "wake" ? "Go to bed at" : "Wake up at";
  const lines = results.map(
    (result) =>
      `${action} ${result.time} — ${result.cycles} cycles (${formatDuration(result.totalSleepMinutes)})${result.recommended ? " ✓ recommended" : ""}`,
  );
  return `My 90-minute sleep cycle plan\n${lines.join("\n")}\nIncludes ~${FALL_ASLEEP_MINUTES} minutes to fall asleep.`;
}
