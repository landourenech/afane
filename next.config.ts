import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser les origines de développement
  allowedDevOrigins: [
    '192.168.188.199',
    'localhost',
    '127.0.0.1',
  ],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;