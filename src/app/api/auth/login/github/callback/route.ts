import { OAuthRequestError } from "@lucia-auth/oauth";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth, githubAuth } from "~/lib/auth";
import { sendMail } from "~/lib/resend";

export const GET = async (request: NextRequest) => {
  const storedState = cookies().get("github_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const { getExistingUser, githubUser, createUser } =
      await githubAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          name: githubUser.name!,
          email: githubUser.email!,
          picture: githubUser.avatar_url,
        },
      });
      sendMail({
        toMail: user.email,
        data: {
          name: user.name,
        },
      });
      return user;
    };

    const user = await getUser();

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard", // redirect to profile page
      },
    });
  } catch (e) {
    console.log(e);

    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
