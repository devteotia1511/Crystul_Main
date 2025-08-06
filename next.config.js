/** @type {import('next').NextConfig} */
const { withNetlify } = require('@netlify/next');

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = withNetlify(nextConfig);