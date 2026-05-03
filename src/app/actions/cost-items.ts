"use server";

import { db } from "@/db";
import { costItems, projects } from "@/db/schema";
import { eq, notInArray, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CostItem } from "@/lib/types";

export async function syncCostItems(projectId: string, items: CostItem[]) {
  await db.transaction(async (tx) => {
    const newItemIds = items.map(i => i.id);
    
    // 1. Delete items not in the new list
    if (newItemIds.length > 0) {
      await tx.delete(costItems)
        .where(
          and(
            eq(costItems.projectId, projectId),
            notInArray(costItems.id, newItemIds)
          )
        );
    } else {
      await tx.delete(costItems).where(eq(costItems.projectId, projectId));
    }

    // 2. Upsert existing items
    for (const item of items) {
      await tx.insert(costItems)
        .values({
          id: item.id,
          projectId,
          type: item.type,
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          metadata: item.metadata || {},
        })
        .onConflictDoUpdate({
          target: costItems.id,
          set: {
            type: item.type,
            description: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            metadata: item.metadata || {},
          },
        });
    }

    // 3. Update project timestamp
    await tx.update(projects)
      .set({ updatedAt: new Date() })
      .where(eq(projects.id, projectId));
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
}

export async function getProjectCostItems(projectId: string) {
  return await db.query.costItems.findMany({
    where: eq(costItems.projectId, projectId),
  });
}
