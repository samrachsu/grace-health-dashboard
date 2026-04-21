const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [roi, agents, teams] = await Promise.all([
      supabaseGet('roi_report', 'select=report_date,total_monthly_value,prior_auth_value,care_gap_value,documentation_value,claims_value,readmission_value,supply_chain_value,access_value,nursing_doc_value&order=report_date.desc,report_generated_at.desc&limit=700'),
      supabaseGet('agent_registry', 'status=eq.Active&select=agent_id'),
      supabaseGet('agent_registry', 'select=team_number'),
    ]);
    return ok({ roi, agents, teams });
  } catch (e) {
    return err('Failed to load overview data');
  }
};
