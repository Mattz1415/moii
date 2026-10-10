/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Abaikan error TypeScript saat build CI
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. Abaikan warning ESLint saat build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 3. Wajib 'export' jika ingin dijadikan APK (menghasilkan folder /out statis)
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
// Catatan: jika file Anda bernama next.config.js (CommonJS), gunakan:
// module.exports = nextConfig;
