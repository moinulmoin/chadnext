const { withContentlayer } = require("next-contentlayer");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: [
      "@prisma/client",
    ],
  },
};

module.exports = withPWA(withContentlayer(nextConfig));
