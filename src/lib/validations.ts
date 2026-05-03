import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  overheadPercent: z.number().min(0).max(100).optional(),
  gpPercent: z.number().min(0).max(100).optional(),
});

export const costItemSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["local_purchase", "consumable", "service", "labor", "material"]),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  metadata: z.record(z.string(), z.any()).optional(),
});
