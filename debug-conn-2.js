const postgres = require('postgres');

async function test(name, url) {
  console.log(`Testing ${name}...`);
  const sql = postgres(url, { connect_timeout: 5 });
  try {
    const result = await sql`SELECT 1`;
    console.log(`${name} Success:`, result);
    return true;
  } catch (err) {
    console.log(`${name} Error:`, err.message || err);
    return false;
  } finally {
    await sql.end();
  }
}

async function run() {
  const originalUrl = process.env.DATABASE_URL;
  const urlObj = new URL(originalUrl);
  const password = urlObj.password;
  const projectId = 'dqfabesdsovgupbvgufy';

  // Pooler URL format: postgresql://postgres.[project-id]:[password]@[pooler-host]:6543/postgres
  const poolerHost = 'aws-0-ap-southeast-1.pooler.supabase.com';
  const poolerUser = `postgres.${projectId}`;
  const poolerUrl = `postgresql://${poolerUser}:${password}@${poolerHost}:6543/postgres`;

  await test('Full Pooler URL', poolerUrl);
}

run();
