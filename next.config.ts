import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // ⬅️ límite aumentado a 5 MB
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jivnxysdyziojckvslqp.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
