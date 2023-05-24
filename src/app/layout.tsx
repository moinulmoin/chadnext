import Header from "@/components/layout/header";
import ThemeProvider from "@/components/shared/theme-provider";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "ChadNext - quickstart for your Next.js project",
	description: "ChadNext - quickstart for your Next.js project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black" />
					<Header />
					<main className="flex min-h-screen w-full flex-col items-center py-32">{children}</main>
					{/* <Footer /> */}
				</ThemeProvider>
			</body>
		</html>
	);
}
