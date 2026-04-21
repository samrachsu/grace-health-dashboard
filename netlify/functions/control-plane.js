const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const logs = await supabaseGet('control_plane_log', 'order=timestamp.desc&limit=200');
    return ok({ logs });
  } catch (e) {
    return err('Failed to load control plane data');
  }
};
