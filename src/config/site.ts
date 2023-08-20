const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://chadnext.moinulmoin.com";

export const siteConfig = {
  name: "ChadNext",
  url: siteUrl,
  ogImage: `${siteUrl}/opengraph-image`,
  description: "Quick Starter Template for your Next.js project.",
  links: {
    twitter: "https://twitter.com/immoinulmoin",
    github: "https://github.com/moinulmoin/chadnext",
  },
};

export type SiteConfig = typeof siteConfig;
