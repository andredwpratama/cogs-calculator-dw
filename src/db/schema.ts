import { pgTable, text, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  overheadPercent: doublePrecision("overhead_percent").default(10).notNull(),
  gpPercent: doublePrecision("gp_percent").default(15).notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const costItems = pgTable("cost_items", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // local_purchase, material, labor, etc.
  description: text("description").notNull(),
  partNumber: text("part_number"),
  quantity: doublePrecision("quantity").notNull().default(1),
  unitPrice: doublePrecision("unit_price").notNull().default(0),
  metadata: jsonb("metadata"), // Stores shape, dimensions, processes, etc.
});
