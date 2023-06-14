import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import db from "~/lib/db";

export const getUser = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await db.user.findFirst({
      where: { id: session.user.id },
    });

    if (user) {
      return user;
    }
  }
};

export interface payload {
  name: string;
  email: string;
  shortBio: string;
  image?: string;
}

export const updateUser = async (id: string, payload: payload) => {
  const updatedUser = await db.user.update({
    where: { id },
    data: { ...payload },
  });

  return updatedUser;
};
