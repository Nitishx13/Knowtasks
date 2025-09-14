/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  env: {
    // Fallback values for build time when env vars might not be available
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_fallback',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'sk_test_fallback',
  },
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
      canvas: false,
    };

    // Handle PDF.js worker
    config.module.rules.push({
      test: /\.pdf$/,
      use: 'file-loader',
    });

    // Handle canvas for react-pdf
    if (config.externals) {
      if (Array.isArray(config.externals)) {
        config.externals.push('canvas');
      } else if (typeof config.externals === 'object') {
        config.externals.canvas = 'canvas';
      }
    } else {
      config.externals = ['canvas'];
    }
    
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure rewrites for API routes and static files
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
  // Increase timeout for API routes
  serverRuntimeConfig: {
    maxDuration: 60,
  },
};

module.exports = nextConfig;