const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [pa, claims] = await Promise.all([
      supabaseGet('prior_auth_triage_results', 'order=denial_risk_score.desc&limit=50'),
      supabaseGet('claims_submission_queue', 'order=queued_at.desc&limit=200'),
    ]);
    return ok({ pa, claims });
  } catch (e) {
    return err('Failed to load revenue cycle data');
  }
};
