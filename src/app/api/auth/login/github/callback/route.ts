import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { sendWelcomeEmail } from "~/actions/mail";
import { setSessionTokenCookie } from "~/lib/cookies";
import { github } from "~/lib/github";
import prisma from "~/lib/prisma";
import { createSession, generateSessionToken } from "~/lib/session";

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

    const existingUser = await prisma.user.findUnique({
      where: {
        githubId: githubUser.id,
      },
    });

    if (existingUser) {
      const sessionTokenCookie = generateSessionToken();
      const session = await createSession(sessionTokenCookie, existingUser.id);
      setSessionTokenCookie(sessionTokenCookie, session.expiresAt);
      return Response.redirect("/dashboard");
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
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
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
