export const siteConfig = {
  name: "ChadNext",
  url:
    process.env.NODE_ENV === "production"
      ? "https://chadnext.moinulmoin.com"
      : "http://localhost:3000",
  ogImage: "https://chadnext.moinulmoin.com/opengraph-image",
  description: "Quick Starter Template for your Next.js project.",
  links: {
    twitter: "https://twitter.com/immoinulmoin",
    github: "https://github.com/moinulmoin/chadnext",
  },
};

export type SiteConfig = typeof siteConfig;
