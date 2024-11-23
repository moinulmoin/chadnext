"use server";

import { revalidateTag } from "next/cache";
import prisma from "~/lib/prisma";
import { utapi } from "~/lib/uploadthing-server";
import { getImageKeyFromUrl, isOurCdnUrl } from "~/lib/utils";
import { type payload } from "~/types";

export const updateUser = async (id: string, payload: payload) => {
  await prisma.user.update({
    where: { id },
    data: { ...payload },
  });

  revalidateTag("session");
};

export async function removeUserOldImageFromCDN(
  newImageUrl: string,
  currentImageUrl: string
) {
  try {
    if (isOurCdnUrl(currentImageUrl)) {
      const currentImageFileKey = getImageKeyFromUrl(currentImageUrl);

      await utapi.deleteFiles(currentImageFileKey as string);
    }
  } catch (e) {
    console.error(e);
    const newImageFileKey = getImageKeyFromUrl(newImageUrl);
    await utapi.deleteFiles(newImageFileKey as string);
  }
}

export async function removeNewImageFromCDN(image: string) {
  const imageFileKey = getImageKeyFromUrl(image);
  await utapi.deleteFiles(imageFileKey as string);
}
