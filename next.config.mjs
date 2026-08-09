/** @type {import('next').NextConfig} */
// use empty string for root deployment; set to '/prefix' for subpath deployments
const repo = "";

const nextConfig = {
  basePath: repo,
  assetPrefix: repo,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;