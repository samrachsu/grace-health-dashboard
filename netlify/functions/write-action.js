const { supabasePatch, ok, err, methodGuard } = require('./_supabase');

// Generic write proxy for dashboard actions (approve/reject/acknowledge)
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } };
  }
  if (event.httpMethod !== 'POST') return err('Method not allowed', 405);

  try {
    const body = JSON.parse(event.body || '{}');
    const { table, filters, data } = body;
    if (!table || !filters || !data) return err('Missing table, filters, or data', 400);

    // Allowlist of tables that can be written to from the dashboard
    const allowed = ['clinical_review_queue', 'improvement_experiments', 'live_transfer_alerts'];
    if (!allowed.includes(table)) return err('Table not allowed', 403);

    await supabasePatch(table, filters, data);
    return ok({ success: true });
  } catch (e) {
    return err('Write action failed');
  }
};
