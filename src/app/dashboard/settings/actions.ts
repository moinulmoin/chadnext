"use server";

import { revalidatePath } from "next/cache";
import db from "~/lib/db";
import { getImageKeyFromUrl, isOurCdnUrl } from "~/lib/utils";
import { utapi } from "~/server/uploadthing";
import { type payload } from "~/types";

export const updateUser = async (id: string, payload: payload) => {
  await db.user.update({
    where: { id },
    data: { ...payload },
  });

  revalidatePath("/dashboard/settings");
};

export async function removeUserOldImageFromCDN(
  id: string,
  newImageUrl: string
) {
  const user = await db.user.findFirst({
    where: { id },
    select: { picture: true },
  });

  const currentImageUrl = user?.picture;

  if (!currentImageUrl) throw new Error("User Picture Missing");

  try {
    if (isOurCdnUrl(currentImageUrl)) {
      const currentImageFileKey = getImageKeyFromUrl(currentImageUrl);

      await utapi.deleteFiles(currentImageFileKey as string);
      revalidatePath("/dashboard/settings");
    }
  } catch (e) {
    if (e instanceof Error) {
      const newImageFileKey = getImageKeyFromUrl(newImageUrl);
      await utapi.deleteFiles(newImageFileKey as string);
      console.error(e.message);
    }
  }
}

export async function removeNewImageFromCDN(image: string) {
  const imageFileKey = getImageKeyFromUrl(image);
  await utapi.deleteFiles(imageFileKey as string);
}
