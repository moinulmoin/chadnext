"use server";

import { type Session, type User } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { cache } from "react";
import { lucia } from "~/lib/lucia";
import prisma from "~/lib/prisma";

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      // next.js throws when you attempt to set cookie when rendering page
    }
    return result;
  }
);

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  redirect("/");
}

export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });
  const code = generateRandomString(6, alphabet("0-9"));
  await prisma.emailVerificationCode.create({
    data: {
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(3, "m")), // 3 minutes
    },
  });
  return code;
}

export async function verifyVerificationCode(
  user: { id: string; email: string },
  code: string
): Promise<boolean> {
  return await prisma.$transaction(async (tx) => {
    const databaseCode = await tx.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!databaseCode || databaseCode.code !== code) {
      return false;
    }

    await tx.emailVerificationCode.delete({
      where: {
        id: databaseCode.id,
      },
    });

    if (!isWithinExpirationDate(databaseCode.expiresAt)) {
      return false;
    }

    if (databaseCode.email !== user.email) {
      return false;
    }

    return true;
  });
}
