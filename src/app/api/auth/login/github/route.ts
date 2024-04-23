import { generateState } from "arctic";
import { cookies } from "next/headers";
import { github } from "~/lib/lucia";

export const GET = async () => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["user:email", "read:user"],
  });

  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
};
