// next.config.ts
import type { NextConfig } from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'rentos-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 24 * 60 * 60, // 24h
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  output: 'standalone', // required for Docker
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = withPWA(nextConfig);
