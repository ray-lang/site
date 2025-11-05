import type { NextConfig } from "next";
import nextra from 'nextra'

const withNextra = nextra({
  // Serve docs from /docs while keeping MDX files in /content
  contentDirBasePath: '/docs'
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      // point to your actual file, include extension
      'next-mdx-import-source-file': './src/mdx-components.tsx'
    }
  }
};

export default withNextra(nextConfig);
