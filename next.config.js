/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/trustwallet/assets/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.stamp.fyi',
        pathname: '/avatar/**'
      }
    ]
  }
}

module.exports = nextConfig
