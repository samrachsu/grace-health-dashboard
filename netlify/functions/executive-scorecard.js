const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const rows = await supabaseGet('kpi_history', 'select=kpi_number,kpi_name,category,value,unit,target,status,snapshot_timestamp&order=kpi_number.asc,snapshot_timestamp.desc');
    return ok({ rows });
  } catch (e) {
    return err('Failed to load scorecard data');
  }
};
