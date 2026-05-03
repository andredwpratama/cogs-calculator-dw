import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  overheadPercent: real("overhead_percent").default(10).notNull(),
  gpPercent: real("gp_percent").default(15).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const costItems = sqliteTable("cost_items", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // local_purchase, material, labor, etc.
  description: text("description").notNull(),
  partNumber: text("part_number"),
  quantity: real("quantity").notNull().default(1),
  unitPrice: real("unit_price").notNull().default(0),
  metadata: text("metadata", { mode: "json" }), // Stores shape, dimensions, processes, etc.
});
