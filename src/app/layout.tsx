import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { cn } from "~/lib/utils";
import { getCurrentLocale } from "~/locales/server";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getCurrentLocale();
  return (
    <html lang={locale}>
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        {children}
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
