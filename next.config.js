/** @type {import('next').NextConfig} */
const repo = 'everest';
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? `/${repo}` : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: isProd ? `/${repo}/` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
