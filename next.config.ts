import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";
import withSerwistInit from "@serwist/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactCompiler: true,
};

// Note: Serwist doesn't support Turbopack in dev. Use `pnpm dev --webpack` for local PWA testing.
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default withMDX(withSerwist(nextConfig));
