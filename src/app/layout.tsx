import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import ThemeProvider from "@/components/shared/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		"Next.js",
		"React",
		"Tailwind CSS",
		"Server Components",
		"shadcn/ui",
		"NextAuth",
		"Prisma",
		"Vercel",
	],
	authors: [
		{
			name: "moinulmoin",
			url: "https://moinulmoin.com",
		},
	],
	creator: "moinulmoin",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
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
	manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black" />
					<Suspense fallback={<Skeleton className="w-full max-w-xl h-16 rounded-full" />}>
						{/* @ts-expect-error Server Components */}
						<Header />
					</Suspense>
					<main className="flex h-[calc(100vh-80px)] w-full flex-col justify-center items-center py-24">
						{children}
					</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
