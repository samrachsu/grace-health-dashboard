const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [memory, runs, skills, registry] = await Promise.all([
      supabaseGet('agent_memory', 'select=*&order=created_at.desc&limit=200'),
      supabaseGet('agent_run_log', 'select=*&order=run_timestamp.desc&limit=500'),
      supabaseGet('agent_skills', 'select=*&order=use_count.desc&limit=200'),
      supabaseGet('agent_registry', 'select=agent_id,agent_name,status&order=agent_id'),
    ]);
    return ok({ memory, runs, skills, registry });
  } catch (e) {
    return err('Failed to load memory data');
  }
};
