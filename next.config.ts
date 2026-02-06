import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "images.unsplash.com",
      },
      {
        protocol: 'https',
        hostname: "images.deliveryhero.io",
      },
      {
        protocol: 'https',
        hostname: "hips.hearstapps.com",
      },
      {
        protocol: 'https',
        hostname: "static.vecteezy.com",
      },
    ],
  },
};

export default nextConfig;
