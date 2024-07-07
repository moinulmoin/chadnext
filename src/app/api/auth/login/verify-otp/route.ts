import { cookies } from "next/headers";
import { verifyVerificationCode } from "~/actions/auth";
import { lucia } from "~/lib/lucia";
import prisma from "~/lib/prisma";

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

    await lucia.invalidateUserSessions(user.id);

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

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
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
