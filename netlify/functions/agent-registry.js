const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [registry, deps] = await Promise.all([
      supabaseGet('agent_registry', 'select=*&order=agent_id'),
      supabaseGet('agent_dependencies', 'select=upstream_agent_id,downstream_agent_id'),
    ]);
    return ok({ registry, deps });
  } catch (e) {
    return err('Failed to load agent registry data');
  }
};
