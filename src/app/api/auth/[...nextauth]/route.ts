import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		}),
	],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
