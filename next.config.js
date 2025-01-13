const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin(
  './i18n.config.ts'
);


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    forceSwcTransforms: true
  },
  //i18n: {
  //  locales: ['en', 'hu'],
  //  defaultLocale: 'hu',
  //  localeDetection: true,
  //},
  //async redirects() {
  //  return [
  //    {
  //      source: '/',
  //      destination: '/hu',
  //      permanent: true,
  //    },
  //  ];
  //},
};

module.exports = withNextIntl(nextConfig);