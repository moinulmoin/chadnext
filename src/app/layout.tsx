import { type Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Footer from "~/components/layout/footer";
import Header from "~/components/layout/header";
import ThemeProvider from "~/components/shared/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { siteConfig } from "~/config/site";

import Script from "next/script";
import * as process from "process";
import { cn } from "~/lib/utils";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "Shadcn/ui",
    "LuciaAuth",
    "Prisma",
    "Vercel",
    "Tailwind",
    "Radix UI",
  ],
  authors: [
    {
      name: "moinulmoin",
      url: "https://moinulmoin.com",
    },
  ],
  creator: "moinulmoin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@immoinulmoin",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/manifest.json`,
  metadataBase: new URL(siteConfig.url),
};

export const viewport = {
  width: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
  loginDialog,
}: {
  children: React.ReactNode;
  loginDialog: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main>
            {children}
            {loginDialog}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
      {process.env.NODE_ENV === "production" && (
        <Script
          src="https://umami.moinulmoin.com/script.js"
          data-website-id="bc66d96a-fc75-4ecd-b0ef-fdd25de8113c"
        />
      )}
    </html>
  );
}
