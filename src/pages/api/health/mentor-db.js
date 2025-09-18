import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Basic headers to ensure JSON
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const env = {
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    NODE_ENV: process.env.NODE_ENV || 'unknown'
  };

  try {
    // Minimal connectivity test
    const ping = await sql`SELECT 1 as up`;

    // Check if mentor_users table exists and count rows
    let tableExists = false;
    let mentorCount = null;
    try {
      const exists = await sql`SELECT to_regclass('public.mentor_users') as reg`;
      tableExists = !!exists?.rows?.[0]?.reg;
      if (tableExists) {
        const count = await sql`SELECT COUNT(*)::int as count FROM mentor_users`;
        mentorCount = count?.rows?.[0]?.count ?? 0;
      }
    } catch (innerErr) {
      // ignore, will be reported below
    }

    return res.status(200).json({
      ok: true,
      message: 'Health check passed',
      env,
      ping: ping?.rows?.[0] ?? null,
      mentor_users: {
        exists: tableExists,
        count: mentorCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error?.message : 'Server error',
      env
    });
  }
}
