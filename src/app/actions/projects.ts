"use server";

import { db } from "@/db";
import { projects, costItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { projectSchema } from "@/lib/validations";

export async function createProject(name: string) {
  projectSchema.parse({ name });
  const id = crypto.randomUUID();
  await db.insert(projects).values({
    id,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  revalidatePath("/");
  return id;
}

export async function getProjects() {
  return await db.query.projects.findMany({
    orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
  });
}

export async function updateProject(id: string, data: Partial<typeof projects.$inferInsert>) {
  await db.update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id));
  revalidatePath(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  await db.delete(costItems).where(eq(costItems.projectId, id));
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/");
}
