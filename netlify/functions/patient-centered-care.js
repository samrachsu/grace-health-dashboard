const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [outreach, gaps, access] = await Promise.all([
      supabaseGet('care_gap_outreach_queue', 'order=priority_score.desc&limit=300'),
      supabaseGet('patient_care_gaps', 'select=open_care_gaps,risk_score,insurance_type&limit=300'),
      supabaseGet('access_operations_report', 'order=report_date.desc&limit=10'),
    ]);
    return ok({ outreach, gaps, access });
  } catch (e) {
    return err('Failed to load patient-centered care data');
  }
};
