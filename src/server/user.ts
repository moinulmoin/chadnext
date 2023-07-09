import { getServerSession } from "next-auth";
import { cache } from "react";
import { utapi } from "uploadthing/server";
import { authOptions } from "~/lib/auth";
import db from "~/lib/db";

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

const isOurCdnUrl = (url: string | null) =>
  url?.includes("utfs.io") || url?.includes("uploadthing.com");

export async function updateUserImage(
  id: string,
  newImage: { url: string; key: string }
) {
  const user = await db.user.findFirst({
    where: { id },
    select: { image: true },
  });

  if (!user) throw new Error("User not found!");

  const currentImageUrl = user.image;
  try {
    if (isOurCdnUrl(currentImageUrl)) {
      const parts = currentImageUrl?.split("/");
      const currentImageFileKey = parts?.at(-1);
      console.log("currentImageFileKey", currentImageFileKey);

      await utapi.deleteFiles(currentImageFileKey as string);
    }
  } catch (e) {
    if (e instanceof Error) {
      await utapi.deleteFiles(newImage.key);
      throw new Error(e.message);
    }
  }

  await db.user.update({
    where: { id },
    data: {
      image: newImage.url,
    },
  });
}
