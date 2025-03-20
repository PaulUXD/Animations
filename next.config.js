/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // If you're using the App Router (Next.js 13+)
  experimental: {
    appDir: true,
  },
  // Do not include output: 'export' for server components
}

module.exports = nextConfig 