"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { alphabet, generateRandomString } from "oslo/crypto";
import { deleteSessionTokenCookie } from "~/lib/cookies";
import prisma from "~/lib/prisma";
import { getCurrentSession, invalidateSession } from "~/lib/session";

export async function logout() {
  const { session } = await getCurrentSession();
  if (!session) {
    return {
      message: "Unauthorized",
    };
  }

  await invalidateSession(session.id);
  deleteSessionTokenCookie();
  revalidatePath("/");
  return redirect("/login");
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
      expiresAt: new Date(Date.now() + 1000 * 60 * 3), // 3 minutes
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

    if (Date.now() > databaseCode.expiresAt.getTime()) {
      return false;
    }

    if (databaseCode.email !== user.email) {
      return false;
    }

    return true;
  });
}
