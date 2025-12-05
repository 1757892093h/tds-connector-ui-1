import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const baseUrl = process.env.TDSC_BASE_URL || 'http://localhost:8085';
    return [
      {
        source: '/tdsc/:path*',
        destination: `${baseUrl}/:path*`,
      },
      {
        source: '/:locale(zh|en)/tdsc/:path*',
        destination: `${baseUrl}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
