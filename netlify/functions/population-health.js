const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const briefs = await supabaseGet('population_health_director_log', 'order=created_at.desc&limit=1');
    return ok({ briefs });
  } catch (e) {
    return err('Failed to load population health data');
  }
};
