import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_BACKEND_URL?.replace("https://", "").replace("http://", "") || "localhost",
      },
    ],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
};

export default nextConfig;
