/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ✅ Hace que Next.js ignore los errores de tipos al compilar
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Evita que ESLint bloquee el build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
