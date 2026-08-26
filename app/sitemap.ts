import type { MetadataRoute } from "next";
import { BASE_URL, TIME_SLUGS } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...TIME_SLUGS.flatMap((time) => [
      { url: `${BASE_URL}/wake-up-at-${time}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
      { url: `${BASE_URL}/sleep-at-${time}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    ]),
  ];
}
