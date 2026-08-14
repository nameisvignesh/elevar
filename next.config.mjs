/** @type {import('next').NextConfig} */

// GitHub Pages project site lives under /elevar. In dev the basePath is empty.
const repo = "elevar";
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
