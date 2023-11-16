const { withContentlayer } = require("next-contentlayer");
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/projects",
        permanent: false,
      },
    ];
  },
};

module.exports = withPWA(withContentlayer(nextConfig));
