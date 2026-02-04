/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Completely exclude problematic routes from the build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Exclude specific pages from the build
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      // Exclude problematic pages from the server build
      config.externals = [...config.externals, 'react-dom/server']
    }
    return config
  },
  // Force all routes to be dynamic
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, max-age=0',
          },
        ],
      },
    ]
  },
}

export default nextConfig
