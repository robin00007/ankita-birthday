/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/ankita-birthday' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ankita-birthday' : '',
};

export default nextConfig;
