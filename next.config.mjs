/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/welcome-step',
        permanent: true,
      }
    ]
  },
};

export default nextConfig;
