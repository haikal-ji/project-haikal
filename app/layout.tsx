import type { Metadata } from "next";
import { Poppins, Geist_Mono, Fraunces } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CustomCursor from "@/components/CustomCursor";
import ThemeInitializer from "@/components/ThemeInitializer";
import LoadingScreen from "@/components/LoadingScreen";

import ScrollBlur from "@/components/ScrollBlur";
import ScrollToTop from "@/components/ScrollToTop";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ekall.vercel.app'),
  title: {
    default: "Haikal — Portofolio",
    template: "%s | Haikal",
  },
  description: "Web developer & creative technologist yang sedang belajar merancang dan membangun website yang rapi, simpel, dan enak diliat.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/haikal-circle.png?v=3', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/haikal-circle.png?v=3',
  },
  keywords: ["portofolio", "web developer", "next.js", "haikal", "desain", "UI/UX"],
  authors: [{ name: "Muh. Haikal" }],
  creator: "Muh. Haikal",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ekall.vercel.app",
    siteName: "Haikal — Portofolio",
    title: "Haikal — Portofolio",
    description: "Web developer & creative technologist yang sedang belajar merancang dan membangun website yang rapi, simpel, dan enak diliat.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Haikal — Portofolio",
      },
      {
        url: "/haikal-hero.jpg",
        width: 800,
        height: 800,
        alt: "Muh. Haikal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haikal — Portofolio",
    description: "Web developer & creative technologist yang sedang belajar merancang dan membangun website yang rapi, simpel, dan enak diliat.",
    images: ["/og-image.png"],
    creator: "@haikal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "aTD5_GM-X3OapH5VwlzrOMt24jq6eh9mEZ9iu_D5EFg",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  const isOwner = !!user && user.email === process.env.OWNER_EMAIL;

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${poppins.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var item = localStorage.getItem('haikal-theme');
                  var isDark = item === 'dark' || item === null;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans">
        <ToastProvider>
          <ThemeInitializer />
          <LoadingScreen />
          <CustomCursor />

          <ScrollBlur />
          <SiteHeader isLoggedIn={isLoggedIn} isOwner={isOwner} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <ScrollToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
