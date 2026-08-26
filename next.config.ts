import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mock evidence/document images ship as local SVGs under /public/mock.
  images: {
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
