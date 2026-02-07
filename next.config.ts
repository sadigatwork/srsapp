// next.config.js - للتطوير فقط
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // تعطيل CSP أثناء التطوير
  async headers() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value:
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
            },
          ],
        },
      ];
    }
    return [];
  },

  // إعدادات أخرى
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
