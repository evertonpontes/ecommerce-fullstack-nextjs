/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: 'fdrrundudwlfxcxezebu.supabase.co',
      },
      {
        hostname: 'g-xk3fronbkn8.vusercontent.net',
      },
      {
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
