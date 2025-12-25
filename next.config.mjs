/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API: process.env.API,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
