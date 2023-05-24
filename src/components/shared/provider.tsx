"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import ThemeProvider from "./theme-provider";

const Provider = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<SessionProvider>{children}</SessionProvider>
		</ThemeProvider>
	);
};

export default Provider;
