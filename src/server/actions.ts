"use server";
import { revalidatePath } from "next/cache";
import { updateUser, type payload } from "./user";

export async function updateUserToDb(id: string, data: payload) {
  "use server";

  await updateUser(id, data);
  revalidatePath("/dashboard/settings");
}
