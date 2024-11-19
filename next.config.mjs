import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

/**
 * @type {import('next').NextConfig}
 */
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
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withSerwist(nextConfig);
