import { cache } from "react";
import db from "~/lib/db";
import { getPageSession } from "~/lib/auth";
import { type payload } from "~/types";

export const getUser = cache(async () => {
  const session = await getPageSession();

  if (session) {
    const user = await db.user.findFirst({
      where: { id: session.user.userId },
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
