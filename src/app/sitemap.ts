import { type MetadataRoute } from "next";
import { siteConfig } from "~/config/site";

const locales = ["en", "fr"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales
    .map((locale) => [
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
    ])
    .flat() as MetadataRoute.Sitemap;
}
