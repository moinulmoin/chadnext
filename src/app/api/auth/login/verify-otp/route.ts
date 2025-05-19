import { revalidatePath } from "next/cache";
import { verifyVerificationCode } from "~/lib/server/auth";
import { setSessionTokenCookie } from "~/lib/server/auth/cookies";
import {
  createSession,
  generateSessionToken,
  invalidateAllSessions,
} from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";

export const POST = async (req: Request, response: Response) => {
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
      },
    });

    if (!user) {
      return new Response("User not found", {
        status: 400,
      });
    }

    const isValid = await verifyVerificationCode(
      { id: user.id, email: user.email! },
      body.code
    );

    if (!isValid) {
      return new Response("Invalid OTP", {
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
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    revalidatePath("/", "layout");
    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
