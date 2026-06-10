/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prototype: don't fail production builds on lint (e.g. unescaped quotes in copy).
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Tree-shake icon imports so only used icons ship.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
