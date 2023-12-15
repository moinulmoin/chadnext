"use server";

import { revalidatePath } from "next/cache";
import { type SendMailProps, type payload } from "~/types";
import { updateUser } from "./user";

import db from "~/lib/db";
import { utapi } from "./uploadthing";
import { getImageKeyFromUrl, isOurCdnUrl } from "./utils";

import ThanksTemp from "emails/thanks";
import { nanoid } from "nanoid";
import { resend } from "~/lib/resend";

export async function checkEmailExists(email: string) {
  const user = await db.user.findFirst({
    where: { email },
  });

  if (!user) throw new Error("Email does not exist");
}

export async function saUpdateUserInDb(id: string, data: payload) {
  await updateUser(id, data);
  revalidatePath("/dashboard/settings");
}

export async function saRemoveUserOldImageFromCDN(id: string, image: string) {
  await removeUserOldImageCDN(id, image);
  revalidatePath("/dashboard/settings");
}

export async function saRemoveNewImageFromCDN(image: string) {
  await removeNewImageFromCDN(image);
}

export async function saCheckEmailExists(email: string) {
  await checkEmailExists(email);
}

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

export const sendMail = async ({ toMail, data }: SendMailProps) => {
  const subject = "Thanks for using ChadNext!";
  const temp = ThanksTemp({ userName: data.name });

  //@ts-expect-error text field is required
  await resend.emails.send({
    from: `ChadNext App <chadnext@moinulmoin.com>`,
    to: toMail,
    subject: subject,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    react: temp,
  });
};
