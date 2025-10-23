import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // ⬅️ límite aumentado a 5 MB
    },
  },
};

export default nextConfig;
