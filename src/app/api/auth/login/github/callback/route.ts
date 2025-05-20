import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sendWelcomeEmail } from "~/lib/server/mail";
import { prisma } from "~/lib/server/db";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const authCallbackUrl = new URL("/api/auth/callback/github", url.origin);
    authCallbackUrl.searchParams.set("code", code);
    authCallbackUrl.searchParams.set("state", state);

    return Response.redirect(authCallbackUrl.toString());
  } catch (error) {
    console.error(error);

    if (error instanceof PrismaClientKnownRequestError) {
      return new Response(error.message, {
        status: 400,
      });
    }

    if (error instanceof Error) {
      return new Response(error.message, {
        status: 400,
      });
    }

    return new Response("Authentication failed", {
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
