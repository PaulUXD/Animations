/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // If you're using the App Router (Next.js 13+)
  experimental: {
    appDir: true,
  },
  // Make sure output is not set to 'export' for server components
  // output: 'export', // Remove this line if it exists
}

module.exports = nextConfig 