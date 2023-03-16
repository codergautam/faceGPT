/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upcdn.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
