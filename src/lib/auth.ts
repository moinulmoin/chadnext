import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import EmailProvider, {
  type SendVerificationRequestParams,
} from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import db from "~/lib/db";
import { sendMail } from "~/lib/resend";

const sendVerificationRequest = async ({
  identifier: email,
  url,
}: SendVerificationRequestParams) => {
  const user = await db.user.findFirst({
    where: {
      email,
    },
    select: {
      name: true,
    },
  });

  try {
    await sendMail({
      toMail: email,
      type: "verification",
      data: {
        name: user?.name as string,
        url,
      },
    });
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      sendVerificationRequest,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (user && isNewUser) {
        await sendMail({
          toMail: user.email as string,
          type: "new-signin",
          data: {
            name: user.name as string,
          },
        });
      }
    },
  },
};
