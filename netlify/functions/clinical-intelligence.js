const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [denials, ehr, inbox, hedis] = await Promise.all([
      supabaseGet('denials_management_log', 'order=detected_at.desc&limit=50'),
      supabaseGet('ehr_query_log', 'order=queried_at.desc&limit=50'),
      supabaseGet('inbox_intelligence_log', 'order=processed_at.desc&limit=50'),
      supabaseGet('hedis_performance_log', 'order=run_date.desc&limit=50'),
    ]);
    return ok({ denials, ehr, inbox, hedis });
  } catch (e) {
    return err('Failed to load clinical intelligence data');
  }
};
