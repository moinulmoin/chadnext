import { type MetadataRoute } from "next";
import { siteConfig } from "~/config/site";
import { getCurrentLocale } from "~/locales/server";

export default function sitemap(): MetadataRoute.Sitemap {
  const locale = getCurrentLocale();
  return [
    {
      url: siteConfig(locale).url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig(locale).url}/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteConfig(locale).url}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${siteConfig(locale).url}/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
