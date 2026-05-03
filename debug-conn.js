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
  if (!originalUrl) {
    console.error('DATABASE_URL not set');
    return;
  }

  const urlObj = new URL(originalUrl);
  console.log('Original Host:', urlObj.hostname);
  console.log('Original Port:', urlObj.port || '5432');

  // Attempt 1: Just change port to 6543 on same host
  const url1 = new URL(originalUrl);
  url1.port = '6543';
  await test('Same Host, Port 6543', url1.toString());

  // Attempt 2: Use pooler host, port 6543
  // We need to inject project id into username if it's not there
  const url2 = new URL(originalUrl);
  url2.hostname = 'aws-0-ap-southeast-1.pooler.supabase.com';
  url2.port = '6543';
  // Supabase pooler requires username to be "postgres.[project-id]"
  // Our project id is dqfabesdsovgupbvgufy
  if (!url2.username.includes('.')) {
     url2.username = url2.username + '.dqfabesdsovgupbvgufy';
  }
  await test('Pooler Host, Port 6543, Updated User', url2.toString());
}

run();
