/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Matches any hostname
        port: "",
        pathname: "/**" // Matches any pathname
      }
    ]
  }
};

export default nextConfig;
