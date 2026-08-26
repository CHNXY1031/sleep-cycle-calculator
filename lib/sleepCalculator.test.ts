import { describe, expect, it } from "vitest";
import {
  calculateBedtimes,
  calculateSleepNow,
  calculateWakeTimes,
  generateTimeSlugs,
  slugToClock,
} from "./sleepCalculator";

describe("sleepCalculator", () => {
  it("adds latency and full cycles to a planned bedtime", () => {
    const results = calculateWakeTimes({ hour: 22, minute: 30 });
    expect(results.map((result) => result.time)).toEqual([
      "7:44 AM",
      "6:14 AM",
      "4:44 AM",
      "3:14 AM",
    ]);
  });

  it("works backwards from a wake target", () => {
    const results = calculateBedtimes({ hour: 6, minute: 30 });
    expect(results[1].time).toBe("10:46 PM");
    expect(results[1].recommended).toBe(true);
  });

  it("calculates sleep-now deterministically", () => {
    const results = calculateSleepNow(new Date(2026, 7, 27, 23, 0));
    expect(results[1].time).toBe("6:44 AM");
  });

  it("generates 96 valid quarter-hour SEO slugs", () => {
    const slugs = generateTimeSlugs();
    expect(slugs).toHaveLength(96);
    expect(slugs).toContain("6-30-am");
    expect(slugToClock("10-30-pm")).toEqual({ hour: 22, minute: 30 });
  });
});
