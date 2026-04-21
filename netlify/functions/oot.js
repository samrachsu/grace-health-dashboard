const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [briefs, scenarios] = await Promise.all([
      supabaseGet('oot_executive_briefs', 'select=brief_id,run_date,run_timestamp,bundle_id,recipient_role,shared_facts_section,emphasis_section,recommended_actions,fact_ids_referenced,fact_ids_emphasized,consistency_check_passed,status,llm_rejections&order=run_date.desc,recipient_role.asc&limit=8'),
      supabaseGet('oot_enterprise_strategy_scenarios', 'select=scenario_id,scenario_type,confidence_tier,net_12_month_impact,narrative,narrative_source,recommended_adaptation,status,governance_signals,run_week,run_timestamp&order=net_12_month_impact.desc'),
    ]);
    return ok({ briefs, scenarios });
  } catch (e) {
    return err('Failed to load OOT data');
  }
};
