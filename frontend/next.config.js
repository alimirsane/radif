const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "slims.2tica.ir",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lims.labs.sharif.edu",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lims.labs.sharif.ir",
        port: "",
      },
      {
        protocol: "https",
        hostname: "172.26.137.161",
        port: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: `/auth/sign-in`,
        permanent: false,
      },
      // {
      //   source: "/dashboard/customer",
      //   destination: `/dashboard/customer/request`,
      //   permanent: false,
      // },
    ];
  },
};
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  ...nextConfig,
});
