import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ArcticFetchError, OAuth2RequestError } from "arctic";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sendWelcomeEmail } from "~/lib/server/mail";
import { setSessionTokenCookie } from "~/lib/server/auth/cookies";
import { github } from "~/lib/server/auth/github";
import { createSession, generateSessionToken } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    if (!githubUser.email) {
      const githubEmailsResponse = await fetch(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
          },
        }
      );
      const githubEmails: {
        email: string;
        primary: boolean;
        verified: boolean;
      }[] = await githubEmailsResponse.json();
      const verifiedEmail = githubEmails.find(
        (email) => email.primary && email.verified
      );
      if (verifiedEmail) githubUser.email = verifiedEmail.email;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            githubId: githubUser.id,
          },
          {
            email: githubUser.email,
          },
        ],
      },
    });

    if (existingUser) {
      const sessionTokenCookie = generateSessionToken();
      const session = await createSession(sessionTokenCookie, existingUser.id);
      await setSessionTokenCookie(sessionTokenCookie, session.expiresAt);
      revalidatePath("/dashboard", "layout");
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const newUser = await prisma.user.create({
      data: {
        githubId: githubUser.id,
        name: githubUser.name,
        email: githubUser.email,
        picture: githubUser.avatar_url,
        emailVerified: Boolean(githubUser.email),
      },
    });

    if (githubUser.email) {
      sendWelcomeEmail({ toMail: newUser.email!, userName: newUser.name! });
    }
    const sessionTokenCookie = generateSessionToken();
    const session = await createSession(sessionTokenCookie, newUser.id);
    await setSessionTokenCookie(sessionTokenCookie, session.expiresAt);
    revalidatePath("/dashboard", "layout");
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (e) {
    console.log(JSON.stringify(e));

    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(e.description, {
        status: 400,
      });
    }

    if (e instanceof ArcticFetchError) {
      // invalid code
      return new Response(e.message, {
        status: 400,
      });
    }

    if (e instanceof PrismaClientKnownRequestError) {
      return new Response(e.message, {
        status: 400,
      });
    }

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};

interface GitHubUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
}
