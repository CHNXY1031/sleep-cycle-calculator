import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TimeLandingPage from "@/components/TimeLandingPage";
import { BASE_URL, TIME_SLUGS } from "@/lib/seo";
import { formatClock, slugToClock } from "@/lib/sleepCalculator";

interface PageProps {
  params: { schedule: string };
}

interface ParsedSchedule {
  type: "wake" | "sleep";
  timeSlug: string;
}

export const dynamicParams = false;

function parseSchedule(schedule: string): ParsedSchedule | null {
  if (schedule.startsWith("wake-up-at-")) {
    return { type: "wake", timeSlug: schedule.slice("wake-up-at-".length) };
  }
  if (schedule.startsWith("sleep-at-")) {
    return { type: "sleep", timeSlug: schedule.slice("sleep-at-".length) };
  }
  return null;
}

export function generateStaticParams() {
  return TIME_SLUGS.flatMap((time) => [
    { schedule: `wake-up-at-${time}` },
    { schedule: `sleep-at-${time}` },
  ]);
}

export function generateMetadata({ params }: PageProps): Metadata {
  const parsed = parseSchedule(params.schedule);
  if (!parsed) return {};
  const clock = slugToClock(parsed.timeSlug);
  if (!clock) return {};

  const time = formatClock(clock);
  const isWake = parsed.type === "wake";
  const title = isWake
    ? `What Time Should I Go to Sleep to Wake Up at ${time}? (Sleep Calculator)`
    : `What Time Should I Wake Up If I Sleep at ${time}? (Sleep Calculator)`;
  const description = isWake
    ? `Calculate the best bedtimes to wake up at ${time} using 90-minute sleep cycles, including 14 minutes to fall asleep.`
    : `Calculate the best wake-up times after sleeping at ${time} using complete 90-minute sleep cycles.`;
  const url = `${BASE_URL}/${params.schedule}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default function SchedulePage({ params }: PageProps) {
  const parsed = parseSchedule(params.schedule);
  if (!parsed) notFound();
  const clock = slugToClock(parsed.timeSlug);
  if (!clock) notFound();
  return <TimeLandingPage type={parsed.type} clock={clock} slug={parsed.timeSlug} />;
}
