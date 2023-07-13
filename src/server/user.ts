import { getServerSession } from "next-auth";
import { cache } from "react";
import { authOptions } from "~/lib/auth";
import db from "~/lib/db";
import { type payload } from "~/types";

export const getUser = cache(async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await db.user.findFirst({
      where: { id: session.user.id },
    });

    if (user) {
      return user;
    }
  }
});

export const updateUser = async (id: string, payload: payload) => {
  const updatedUser = await db.user.update({
    where: { id },
    data: { ...payload },
  });

  return updatedUser;
};
