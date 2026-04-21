const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [burden, followup, risk] = await Promise.all([
      supabaseGet('documentation_burden_report', 'order=department.asc&limit=50'),
      supabaseGet('patient_followup_queue', 'order=days_since_discharge.desc&limit=200'),
      supabaseGet('patient_risk_details', 'select=tier&limit=500'),
    ]);
    return ok({ burden, followup, risk });
  } catch (e) {
    return err('Failed to load clinical operations data');
  }
};
