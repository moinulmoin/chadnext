import { utapi } from "uploadthing/server";
import db from "~/lib/db";

const isOurCdnUrl = (url: string) =>
  url?.includes("utfs.io") || url?.includes("uploadthing.com");

const getImageKeyFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts.at(-1);
};

export async function removeUserOldImageCDN(id: string, newImageUrl: string) {
  const user = await db.user.findFirst({
    where: { id },
    select: { picture: true },
  });

  const currentImageUrl = user?.picture;

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

export async function removeNewImageFromCDN(image: string) {
  const imageFileKey = getImageKeyFromUrl(image);
  await utapi.deleteFiles(imageFileKey as string);
}

export async function checkEmailExists(email: string) {
  const user = await db.user.findFirst({
    where: { email },
  });

  if (!user) throw new Error("Email does not exist");
}

export class FreePlanLimitError extends Error {
  constructor(message = "Upgrade your plan!") {
    super(message);
  }
}
