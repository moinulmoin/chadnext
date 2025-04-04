export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://chadnext.moinulmoin.com";

export const siteConfig = (locale: string = "en") => ({
  name: "ChadNext",
  url: siteUrl + "/" + locale,
  ogImage: `${siteUrl}/${locale}/opengraph-image`,
  description: "Quick Starter Template for your Next project.",
  links: {
    twitter: "https://twitter.com/immoinulmoin",
    github: "https://github.com/moinulmoin/chadnext",
  },
});

export type SiteConfig = typeof siteConfig;
