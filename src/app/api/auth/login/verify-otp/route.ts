import { verifyVerificationCode } from "~/actions/auth";
import { setSessionTokenCookie } from "~/lib/cookies";
import prisma from "~/lib/prisma";
import {
  createSession,
  generateSessionToken,
  invalidateAllSessions,
} from "~/lib/session";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        sessions: true,
      },
    });

    if (!user) {
      return new Response(null, {
        status: 400,
      });
    }

    const isValid = await verifyVerificationCode(
      { id: user.id, email: body.email },
      body.code
    );

    if (!isValid) {
      return new Response(null, {
        status: 400,
      });
    }

    await invalidateAllSessions(user.id);

    if (!user.emailVerified) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: true,
        },
      });
    }
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSessionTokenCookie(sessionToken, session.expiresAt);

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new Response(null, {
      status: 500,
    });
  }
};
