import type { Metadata } from "next";
import { Poppins, Geist_Mono, Fraunces } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ReadingProgress from "@/components/ReadingProgress";
import CustomCursor from "@/components/CustomCursor";
import ThemeInitializer from "@/components/ThemeInitializer";
import LoadingScreen from "@/components/LoadingScreen";

import ScrollBlur from "@/components/ScrollBlur";
import "./globals.css";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://haikal.vercel.app'),
  title: {
    default: "Haikal — Portofolio",
    template: "%s | Haikal",
  },
  description: "Web developer & creative technologist yang sedang belajar merancang dan membangun website yang rapi, simpel, dan enak diliat.",
  keywords: ["portofolio", "web developer", "next.js", "haikal", "desain", "UI/UX"],
  authors: [{ name: "Muh. Haikal" }],
  creator: "Muh. Haikal",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://haikal.vercel.app",
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
      className={`dark ${poppins.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans">
        <ThemeInitializer />
        <LoadingScreen />
        <ReadingProgress />
        <CustomCursor />

        <ScrollBlur />
        <SiteHeader isLoggedIn={isLoggedIn} isOwner={isOwner} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
