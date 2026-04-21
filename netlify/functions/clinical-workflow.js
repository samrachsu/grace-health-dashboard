const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [notes, friction, alerts] = await Promise.all([
      supabaseGet('note_drafts', 'select=id,physician_id,generated_at&limit=500'),
      supabaseGet('nursing_doc_friction_log', 'select=unit_name,friction_category,priority,estimated_time_cost_min_per_shift&order=created_at.desc&limit=200'),
      supabaseGet('physician_documentation_alerts', 'order=generated_at.desc&limit=50'),
    ]);
    return ok({ notes, friction, alerts });
  } catch (e) {
    return err('Failed to load clinical workflow data');
  }
};
