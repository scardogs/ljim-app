/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Increase API timeouts for file uploads
  serverActions: {
    bodySizeLimit: "10mb",
  },
  experimental: {
    serverMinification: false,
  },
};

export default nextConfig;
