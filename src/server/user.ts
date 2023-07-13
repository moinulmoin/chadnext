import { getServerSession } from "next-auth";
import { cache } from "react";
import { utapi } from "uploadthing/server";
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

const isOurCdnUrl = (url: string) =>
  url?.includes("utfs.io") || url?.includes("uploadthing.com");

export async function removeUserOldImageCDN(id: string, newImageUrl: string) {
  const user = await db.user.findFirst({
    where: { id },
    select: { image: true },
  });

  const currentImageUrl = user?.image;

  if (!currentImageUrl) return;

  try {
    if (isOurCdnUrl(currentImageUrl)) {
      const currentImageFileKey = getImageKeyFromUrl(currentImageUrl);

      await utapi.deleteFiles(currentImageFileKey as string);
    }
  } catch (e) {
    if (e instanceof Error) {
      const newImageFileKey = getImageKeyFromUrl(newImageUrl);
      await utapi.deleteFiles(newImageFileKey as string);
      console.error(e.message);
    }
  }
}

const getImageKeyFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts.at(-1);
};

export async function removeNewImageFromCDN(image: string) {
  const imageFileKey = getImageKeyFromUrl(image);
  await utapi.deleteFiles(imageFileKey as string);
}
