// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["leparle.com"], // Ajoute le domaine ici
    },
      eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;
