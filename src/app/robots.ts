import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_APP_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
