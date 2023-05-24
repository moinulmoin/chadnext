import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import ThemeProvider from "@/components/shared/theme-provider";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
// 	title: "ChadNext - quickstart for your Next.js project",
// 	description: "ChadNext - quickstart for your Next.js project",
// };

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
					<Header />
					<main className="flex min-h-screen w-full flex-col items-center py-32">{children}</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
