const postgres = require('postgres');
require('dotenv').config();

const url = process.env.DATABASE_URL || process.env.supabase_string;
if (!url) {
  console.error('Error: DATABASE_URL or supabase_string not set');
  process.exit(1);
}
const sql = postgres(url, { prepare: false });

async function test() {
  try {
    const result = await sql`SELECT 1`;
    console.log('Success:', result);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.end();
  }
}

test();
