/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*'], // This will be replaced with specific domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
