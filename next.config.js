/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'standalone', // Plesk deployment için
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "isomorphic-furyroad.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  transpilePackages: ["core"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@public': require('path').resolve(__dirname, 'public'),
    };
    return config;
  },
};
