const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [shortage, reqs, flight, vacancy] = await Promise.all([
      supabaseGet('shortage_forecasts', 'order=combined_score.desc&limit=100'),
      supabaseGet('open_requisitions', 'order=days_open.desc&limit=50'),
      supabaseGet('flight_risk_scores', 'order=flight_risk_score.desc&limit=100'),
      supabaseGet('chronic_vacancies', 'order=days_open.desc&limit=50'),
    ]);
    return ok({ shortage, reqs, flight, vacancy });
  } catch (e) {
    return err('Failed to load workforce data');
  }
};
