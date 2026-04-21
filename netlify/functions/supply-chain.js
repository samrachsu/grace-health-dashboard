const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [worklist, txn] = await Promise.all([
      supabaseGet('supply_worklist', 'order=variance_pct.desc&limit=50'),
      supabaseGet('supply_transactions', 'select=department,actual_cost,expected_cost,item_name,vendor_name&order=actual_cost.desc&limit=20'),
    ]);
    return ok({ worklist, txn });
  } catch (e) {
    return err('Failed to load supply chain data');
  }
};
