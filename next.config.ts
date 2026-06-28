import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Üst dizindeki başka bir lockfile karışmasın diye kökü sabitle.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
