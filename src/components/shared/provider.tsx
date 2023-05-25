"use client";

import { ReactNode } from "react";
import ThemeProvider from "./theme-provider";

const Provider = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
		</ThemeProvider>
	);
};

export default Provider;
