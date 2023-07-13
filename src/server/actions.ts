"use server";

import { revalidatePath } from "next/cache";
import { type payload } from "~/types";
import {
  removeNewImageFromCDN,
  removeUserOldImageCDN,
  updateUser,
} from "./user";

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
