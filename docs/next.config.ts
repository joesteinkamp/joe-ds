import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  transpilePackages: [
    "@js-ds-ui/components",
    "@js-ds-ui/color-generator",
    "@js-ds-ui/tokens",
  ],
};

module.exports = withMDX(nextConfig);

export default withMDX(nextConfig);


