"use server";

import { revalidatePath } from "next/cache";
import { type payload } from "~/types";
import { updateUser } from "./user";

import {
  checkEmailExists,
  removeNewImageFromCDN,
  removeUserOldImageCDN,
} from "./utils";

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
