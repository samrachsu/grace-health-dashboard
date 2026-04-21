// Shared Supabase REST helper for Netlify Functions
// Uses service_role key from environment — never exposed to client

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supabaseGet(table, query) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase configuration');
  }
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const resp = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Accept': 'application/json',
    },
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Supabase ${resp.status}: ${table}`);
  }
  return resp.json();
}

async function supabasePatch(table, filters, data) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase configuration');
  }
  const url = `${SUPABASE_URL}/rest/v1/${table}?${filters}`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) {
    throw new Error(`Supabase PATCH ${resp.status}: ${table}`);
  }
  return { ok: true };
}

function ok(body) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body),
  };
}

function err(msg, status = 500) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: msg }),
  };
}

function methodGuard(event) {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST' && event.httpMethod !== 'OPTIONS') {
    return err('Method not allowed', 405);
  }
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }
  return null;
}

module.exports = { supabaseGet, supabasePatch, ok, err, methodGuard };
