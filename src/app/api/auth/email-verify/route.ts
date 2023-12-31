import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { isWithinExpirationDate } from "oslo";
import db from "~/lib/db";
import { lucia } from "~/lib/lucia";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const verificationToken = url.searchParams.get("token");

  if (!verificationToken) {
    return new Response("Invalid token", {
      status: 400,
    });
  }

  try {
    const [token] = await db.$transaction([
      db.emailVerificationToken.findFirst({
        where: {
          id: verificationToken!,
        },
      }),
      db.emailVerificationToken.delete({
        where: {
          id: verificationToken!,
        },
      }),
    ]);

    if (!token || !isWithinExpirationDate(token.expiresAt)) {
      return new Response("Token expired", {
        status: 400,
      });
    }
    const user = await db.user.findFirst({
      where: {
        id: token.userId,
      },
    });
    if (!user || user.email !== token.email) {
      return new Response("Invalid token", {
        status: 400,
      });
    }

    await lucia.invalidateUserSessions(user.id);
    await db.user.upsert({
      where: {
        id: user.id,
        emailVerified: false,
      },
      update: {
        emailVerified: true,
      },
      create: {},
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
      },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (
        error.code === "P2025" ||
        error.meta?.cause === "Record to delete does not exist."
      ) {
        return new Response("Token already used", {
          status: 404,
        });
      }
    }

    return new Response("Something went wrong.", {
      status: 500,
    });
  }
};
