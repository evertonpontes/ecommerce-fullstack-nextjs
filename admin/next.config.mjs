/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'fdrrundudwlfxcxezebu.supabase.co',
      },
      {
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
