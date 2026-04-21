const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [flags, logs, alerts] = await Promise.all([
      supabaseGet('governance_dashboard_flags', 'order=team.asc,agent_name.asc'),
      supabaseGet('governance_log', 'severity=neq.OK&order=checked_at.desc&limit=20'),
      supabaseGet('governance_alerts', 'acknowledged=eq.false&order=created_at.desc&limit=10'),
    ]);
    return ok({ flags, logs, alerts });
  } catch (e) {
    return err('Failed to load governance data');
  }
};
