import { type MetadataRoute } from "next";
import { siteConfig } from "~/config/site";
import { getCurrentLocale } from "~/locales/server";

export default function robots(): MetadataRoute.Robots {
  const locale = getCurrentLocale();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", `/${locale}/dashboard`],
    },
    sitemap: [`${siteConfig(locale).url}/sitemap.xml`],
  };
}
