/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.namu.wiki'],
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

module.exports = nextConfig
