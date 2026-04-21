const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [briefs, boards] = await Promise.all([
      supabaseGet('cfo_daily_brief_log', 'order=run_date.desc&limit=1'),
      supabaseGet('cfo_board_report_log', 'order=created_at.desc&limit=1'),
    ]);
    return ok({ briefs, boards });
  } catch (e) {
    return err('Failed to load CFO data');
  }
};
