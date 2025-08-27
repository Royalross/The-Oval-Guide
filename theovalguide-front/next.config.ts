import path from "path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  // If you also do Node tracing at build time (for monorepos, Docker, etc.):
  // outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
