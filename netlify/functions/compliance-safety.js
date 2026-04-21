const { supabaseGet, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;
  try {
    const [digest, training, policies, contracts] = await Promise.all([
      supabaseGet('daily_compliance_digest', 'order=digest_date.desc&limit=45'),
      supabaseGet('staff_training_records', 'select=hipaa_training_status,role&limit=500'),
      supabaseGet('policy_documents', 'select=status,next_review_date&limit=50'),
      supabaseGet('vendor_contracts', 'select=status,expiration_date,has_baa&limit=50'),
    ]);
    return ok({ digest, training, policies, contracts });
  } catch (e) {
    return err('Failed to load compliance data');
  }
};
