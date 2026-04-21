const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

async function tryGet(table, query) {
  try { return await supabaseGet(table, query); }
  catch { return []; }
}

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [cycles, baselines, exps, bias, versions, weeklyCycles] = await Promise.all([
      tryGet('autoresearch_cycles', 'order=created_at.desc&limit=1'),
      tryGet('agent_performance_baselines', 'order=drift_severity.desc,agent_id.asc&limit=74'),
      tryGet('improvement_experiments', 'status=in.(PROPOSED,ACTIVE)&order=created_at.desc&limit=20'),
      tryGet('automation_bias_monitor', 'order=team_number.asc&limit=16'),
      tryGet('agent_version_history', 'order=created_at.desc&limit=10'),
      tryGet('autoresearch_cycles', 'cycle_type=eq.WEEKLY&order=created_at.desc&limit=1'),
    ]);
    return ok({ cycles, baselines, exps, bias, versions, weeklyCycles });
  } catch (e) {
    return err('Failed to load agent performance data');
  }
};
