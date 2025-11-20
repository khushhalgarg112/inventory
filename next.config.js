/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Disable tracing to avoid OneDrive sync issues
  webpack: (config) => {
    config.infrastructureLogging = { level: "error" };
    return config;
  },
};

module.exports = nextConfig;
