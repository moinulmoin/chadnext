"use server";

import { revalidatePath } from "next/cache";
import { updateUser, updateUserImage, type payload } from "./user";

export async function updateUserInDb(id: string, data: payload) {
  "use server";

  await updateUser(id, data);
  revalidatePath("/dashboard/settings");
}

export async function updateUserImageInDb(
  id: string,
  data: { url: string; key: string }
) {
  "use server";

  await updateUserImage(id, data);
  revalidatePath("/dashboard/settings");
}
