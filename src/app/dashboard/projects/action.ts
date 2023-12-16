"use server";

import { type Project } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPageSession } from "~/lib/auth";
import db from "~/lib/db";
import { getUserSubscriptionPlan } from "~/lib/subscription";

interface Payload {
  name: string;
  domain: string;
}

export async function createProject(payload: Payload) {
  const session = await getPageSession();

  await db.project.create({
    data: {
      ...payload,
      user: {
        connect: {
          id: session?.user?.userId,
        },
      },
    },
  });

  revalidatePath(`/dashboard/projects`);
}

export async function checkIfFreePlanLimitReached() {
  const session = await getPageSession();
  const subscriptionPlan = await getUserSubscriptionPlan(
    session?.user?.userId as string
  );

  // If user is on a free plan.
  // Check if user has reached limit of 3 projects.
  if (subscriptionPlan?.isPro) return false;

  const count = await db.project.count({
    where: {
      userId: session?.user?.userId,
    },
  });

  return count >= 3;
}

export async function getProjects() {
  const session = await getPageSession();
  const projects = await db.project.findMany({
    where: {
      userId: session?.user?.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects as Project[];
}

export async function getProjectById(id: string) {
  const session = await getPageSession();
  const project = await db.project.findFirst({
    where: {
      id,
      userId: session?.user?.userId,
    },
  });
  return project as Project;
}

export async function updateProjectById(id: string, payload: Payload) {
  const session = await getPageSession();
  await db.project.update({
    where: {
      id,
      userId: session?.user?.userId,
    },
    data: payload,
  });
  revalidatePath(`/dashboard/projects`);
}

export async function deleteProjectById(id: string) {
  const session = await getPageSession();
  await db.project.delete({
    where: {
      id,
      userId: session?.user?.userId,
    },
  });
  revalidatePath(`/dashboard/projects`);
  redirect("/dashboard/projects");
}
