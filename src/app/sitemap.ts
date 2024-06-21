import { type MetadataRoute } from "next";
import { siteUrl } from "~/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          fr: `${siteUrl}/fr`,
        },
      },
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: {
        languages: {
          en: `${siteUrl}/en/login`,
          fr: `${siteUrl}/fr/login`,
        },
      },
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: {
        languages: {
          en: `${siteUrl}/en/about`,
          fr: `${siteUrl}/fr/about`,
        },
      },
    },
    {
      url: `${siteUrl}/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: {
        languages: {
          en: `${siteUrl}/en/changelog`,
          fr: `${siteUrl}/fr/changelog`,
        },
      },
    },
  ];
}
