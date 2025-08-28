/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    // Remove appDir as it's not supported in this Next.js version
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
    };
    
    // Handle Node.js modules in client-side code
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['src'],
  },
  // Configure rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Increase timeout for API routes
  serverRuntimeConfig: {
    maxDuration: 60,
  },
};

module.exports = nextConfig;