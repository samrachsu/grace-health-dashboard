const { supabaseGet, supabasePatch, ok, err, methodGuard } = require('./_supabase');

exports.handler = async (event) => {
  const guard = methodGuard(event);
  if (guard) return guard;

  // POST = approve/reject action
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { action, reviewId, reviewer, rejectionReason } = body;
      if (!reviewId || !action) return err('Missing reviewId or action', 400);
      const data = action === 'approve'
        ? { status: 'Approved', reviewed_at: new Date().toISOString(), reviewer: reviewer || 'Dashboard' }
        : { status: 'Rejected', reviewed_at: new Date().toISOString(), reviewer: reviewer || 'Dashboard', rejection_reason: rejectionReason || '' };
      await supabasePatch('clinical_review_queue', `review_id=eq.${reviewId}`, data);
      return ok({ success: true });
    } catch (e) {
      return err('Failed to update review');
    }
  }

  // GET = load review queue
  try {
    const [pending, processed] = await Promise.all([
      supabaseGet('clinical_review_queue', 'status=eq.Pending&order=submitted_at.asc'),
      supabaseGet('clinical_review_queue', 'status=in.(Approved,Rejected,Processed)&order=reviewed_at.desc&limit=20'),
    ]);
    return ok({ pending, processed });
  } catch (e) {
    return err('Failed to load clinical review data');
  }
};
