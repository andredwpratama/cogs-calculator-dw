import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { projects, costItems } from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sql = neon(connectionString);
  const db = drizzle(sql);

  console.log("Seeding database...");

  const projectId = crypto.randomUUID();

  await db.insert(projects).values({
    id: projectId,
    name: "Demo Fabrication Project",
    overheadPercent: 10,
    gpPercent: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(costItems).values([
    {
      id: crypto.randomUUID(),
      projectId,
      type: "material",
      description: "PLATE - ASTM A36",
      partNumber: "PL-001",
      quantity: 10,
      unitPrice: 12000,
      metadata: {
        shape: "plate",
        dimensions: { length: 2400, width: 1200, thickness: 10 },
        weight: 226.08,
      },
    },
    {
      id: crypto.randomUUID(),
      projectId,
      type: "labor",
      description: "Welder Grade A",
      quantity: 2,
      unitPrice: 50000,
      metadata: { hours: 40 },
    },
  ]);

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
