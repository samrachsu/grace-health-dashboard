const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [logs, escalations, pendingAlerts] = await Promise.all([
      supabaseGet('call_center_logs', `created_at=gte.${since}&select=call_reason,resolution,escalation_flag,call_duration_sec`),
      supabaseGet('call_center_logs', `escalation_flag=eq.true&created_at=gte.${since}&select=caller_name,call_reason,escalation_reason,created_at&order=created_at.desc&limit=10`),
      supabaseGet('live_transfer_alerts', 'acknowledged=eq.false&order=created_at.desc&limit=5'),
    ]);
    return ok({ logs, escalations, pendingAlerts });
  } catch (e) {
    return err('Failed to load call center data');
  }
};
