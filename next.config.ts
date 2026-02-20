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
      {
        protocol: 'https',
        hostname: "sultansdinebd.com",
      },
      {
        protocol: 'https',
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: 'https',
        hostname: "img.freepik.com",
      },
      {
        protocol: 'https',
        hostname: "encrypted-tbn0.gstatic.com",
      }
    ],
  },
};

export default nextConfig;
