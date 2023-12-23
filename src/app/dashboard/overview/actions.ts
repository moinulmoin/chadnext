"use server";

import { ForbiddenError } from "@casl/ability";
import { unstable_noStore as noStore } from "next/cache";
import { getAbility } from "~/lib/auth";
import db from "~/lib/db";

export async function countAllProjects() {
  noStore();
  const ability = await getAbility();
  ForbiddenError.from(ability).throwUnlessCan("manage", "all");
  const countProjects = await db.project.count();
  return countProjects;
}

export async function countAllUsers() {
  noStore();
  const ability = await getAbility();
  ForbiddenError.from(ability).throwUnlessCan("manage", "all");
  const countUsers = await db.user.count();
  return countUsers;
}
