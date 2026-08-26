import { generateTimeSlugs } from "./sleepCalculator";

export const BASE_URL = "https://sleep-cycle-calculator.vercel.app";
export const TIME_SLUGS = generateTimeSlugs(15);

export const POPULAR_WAKE_SLUGS = [
  "5-30-am",
  "6-00-am",
  "6-30-am",
  "7-00-am",
  "7-30-am",
  "8-00-am",
  "8-30-am",
  "9-00-am",
];

export const POPULAR_SLEEP_SLUGS = [
  "9-00-pm",
  "9-30-pm",
  "10-00-pm",
  "10-30-pm",
  "11-00-pm",
  "11-30-pm",
  "12-00-am",
  "12-30-am",
];
