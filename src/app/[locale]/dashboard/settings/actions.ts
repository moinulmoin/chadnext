"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "~/lib/server/db";
import { utapi } from "~/lib/server/upload";
import { getImageKeyFromUrl, isOurCdnUrl } from "~/lib/utils";
import { type payload } from "~/types";

export const updateUser = async (id: string, payload: payload) => {
  await prisma.user.update({
    where: { id },
    data: { ...payload },
  });

  revalidatePath("/dashboard/settings");
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
    console.log(e);
    const newImageFileKey = getImageKeyFromUrl(newImageUrl);
    await utapi.deleteFiles(newImageFileKey as string);
  }
}

export async function removeNewImageFromCDN(image: string) {
  const imageFileKey = getImageKeyFromUrl(image);
  await utapi.deleteFiles(imageFileKey as string);
}
