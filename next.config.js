/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['0.0.0.0', 'img.youtube.com', 'i.ytimg.com'],
  },
  webpack: (config, { isServer }) => {
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
}

module.exports = nextConfig
