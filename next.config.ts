import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Workaround para bug de Next.js 16.2.6 con Turbopack y layouts
    // https://github.com/vercel/next.js/issues/...
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // imágenes user-generated pueden venir de cualquier dominio
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
