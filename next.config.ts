import type { NextConfig } from "next";

// CSP configuration
// CATATAN: 'unsafe-inline' diizinkan untuk style-src karena GSAP (manipulasi inline style untuk animasi),
// Tiptap rich-text editor, Tailwind CSS v4, dan dynamic styling React memerlukan inline styles.
// Restart trigger for updated Prisma schema
const isDev = process.env.NODE_ENV === 'development';

const cspDirectives = [
  "default-src 'self'",
  // Next.js App Router uses inline streaming scripts (self.__next_f) for RSC payloads
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'", // 'unsafe-inline' diperlukan untuk GSAP, Tiptap, dan Tailwind CSS
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://*.googleusercontent.com https://*.supabase.co https://*.google.com https://*.gstatic.com https://*.googleapis.com https://*.openstreetmap.org",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google.com https://*.googleapis.com",
  "frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com https://*.openstreetmap.org",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
          },
        ],
      },
    ];
  },
};

export default nextConfig;

