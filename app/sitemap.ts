import type { MetadataRoute } from "next";
import { sections } from "@/data/site";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...Object.values(sections).map((s) => ({
      url: `${siteUrl}${s.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
