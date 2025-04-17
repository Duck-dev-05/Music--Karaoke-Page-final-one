/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Fix for node:async_hooks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "async_hooks": false,
    };

    // Optimize chunk loading
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
        shared: {
          name: (module, chunks) => {
            return `shared-${chunks.map((c) => c.name).join('~')}`
          },
          chunks: 'all',
          minChunks: 2,
        },
      },
    }
    return config
  },
  experimental: {
    // Ensure proper SWC compilation
    forceSwcTransforms: true
  }
}

module.exports = nextConfig
