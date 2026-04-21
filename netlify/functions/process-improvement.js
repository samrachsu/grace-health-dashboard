const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [sessions, painPts, recs, zones] = await Promise.all([
      supabaseGet('interview_sessions', 'order=interview_date.desc&limit=50'),
      supabaseGet('interview_pain_points', 'order=severity_score.desc&limit=50'),
      supabaseGet('work_redesign_recommendations', 'order=projected_monthly_value.desc&limit=50'),
      supabaseGet('ai_opportunity_zones', 'select=opportunity_type,estimated_time_saved_hours_per_week,estimated_monthly_value&limit=300'),
    ]);
    return ok({ sessions, painPts, recs, zones });
  } catch (e) {
    return err('Failed to load process improvement data');
  }
};
