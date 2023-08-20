"use server";

import { type Project } from "@prisma/client";
import { getServerSession, type Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "~/lib/auth";
import db from "~/lib/db";

interface Payload {
  name: string;
  website: string;
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
}

export async function getUser() {
  const session = (await getServerSession(authOptions)) as Session;

  return session.user;
}
