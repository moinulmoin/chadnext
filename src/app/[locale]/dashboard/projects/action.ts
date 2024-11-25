"use server";

import { type Project } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentSession } from "~/lib/server/auth/session";
import { prisma } from "~/lib/server/db";
import { getUserSubscriptionPlan } from "~/lib/server/payment";

interface Payload {
  name: string;
  domain: string;
}

export async function createProject(payload: Payload) {
  const { user } = await getCurrentSession();

  await prisma.project.create({
    data: {
      ...payload,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  revalidatePath(`/dashboard/projects`);
}

export async function checkIfFreePlanLimitReached() {
  const { user } = await getCurrentSession();
  const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);

  // If user is on a free plan.
  // Check if user has reached limit of 3 projects.
  if (subscriptionPlan?.isPro) return false;

  const count = await prisma.project.count({
    where: {
      userId: user?.id,
    },
  });

  return count >= 3;
}

export async function getProjects() {
  const { user } = await getCurrentSession();
  const projects = await prisma.project.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects as Project[];
}

export async function getProjectById(id: string) {
  const { user } = await getCurrentSession();
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user?.id,
    },
  });
  return project as Project;
}

export async function updateProjectById(id: string, payload: Payload) {
  const { user } = await getCurrentSession();
  await prisma.project.update({
    where: {
      id,
      userId: user?.id,
    },
    data: payload,
  });
  revalidatePath(`/dashboard/projects`);
}

export async function deleteProjectById(id: string) {
  const { user } = await getCurrentSession();
  await prisma.project.delete({
    where: {
      id,
      userId: user?.id,
    },
  });
  revalidatePath(`/dashboard/projects`);
  redirect("/dashboard/projects");
}
