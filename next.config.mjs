/** @type {import('next').NextConfig} */

// GitHub Pages lives under /elevar; Vercel and local development use the root.
const repo = "elevar";
const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const basePath = isProd && !isVercel ? `/${repo}` : "";
const videoBaseUrl = isVercel ? `https://nameisvignesh.github.io/${repo}` : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_SITE_BASE_PATH: basePath,
    NEXT_PUBLIC_VIDEO_BASE_URL: videoBaseUrl,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
