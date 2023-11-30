"use server";

import { type Project } from "@prisma/client";
import { getServerSession, type Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "~/lib/auth";
import db from "~/lib/db";
import { getUserSubscriptionPlan } from "~/lib/subscription";

interface Payload {
  name: string;
  domain: string;
}

export async function createProject(payload: Payload) {
  const user = await getUser();

  await db.project.create({
    data: {
      ...payload,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  revalidatePath(`/dashboard/projects`);
}

export async function checkIfFreePlanLimitReached() {
  const user = await getUser();
  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  // If user is on a free plan.
  // Check if user has reached limit of 3 projects.
  if (subscriptionPlan?.isPro) return false;

  const count = await db.project.count({
    where: {
      userId: user.id,
    },
  });

  return count >= 3;
}

export async function getProjects() {
  const user = await getUser();
  const projects = await db.project.findMany({
    where: {
      userId: user.id,
    },
  });
  return projects as Project[];
}

export async function getProjectById(id: string) {
  const user = await getUser();
  const project = await db.project.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });
  return project as Project;
}

export async function updateProjectById(id: string, payload: Payload) {
  const user = await getUser();
  await db.project.update({
    where: {
      id,
      userId: user.id,
    },
    data: payload,
  });
  revalidatePath(`/dashboard/projects`);
}

export async function deleteProjectById(id: string) {
  const user = await getUser();
  await db.project.delete({
    where: {
      id,
      userId: user.id,
    },
  });
  revalidatePath(`/dashboard/projects`);
  redirect("/dashboard/projects");
}

export async function getUser() {
  const session = (await getServerSession(authOptions)) as Session;

  return session.user;
}
