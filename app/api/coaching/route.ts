export async function POST(request: Request) {
  const body = await request.json();
  
  const tips = [];

  // Analyze and generate tips
  if (body.accounts === 0) {
    tips.push('Start by adding your first account to your pipeline. This will help you organize all your prospects and track progress.');
  }

  if (body.activeDeals > 0) {
    tips.push(`You have ${body.activeDeals} active deal(s). Focus on these high-priority opportunities and move them forward this week.`);
  }

  if (body.activities < 5) {
    tips.push('Aim for at least 5 activities per week. Each activity (call, email, meeting) moves deals closer to closing.');
  } else {
    tips.push(`Great activity level! You logged ${body.activities} activities. Keep pushing to exceed your goals.`);
  }

  if (body.totalValue > 100000) {
    tips.push(`Your pipeline is worth $${(body.totalValue / 1000).toFixed(0)}K - excellent! Focus on the highest-value deals to maximize commission.`);
  }

  if (body.accounts > 10) {
    tips.push('You have a solid pipeline! Prioritize your time on qualified leads rather than spreading yourself too thin.');
  }

  // Activity type insights
  const callCount = body.recentActivities?.filter((a: any) => a.type === 'call').length || 0;
  const emailCount = body.recentActivities?.filter((a: any) => a.type === 'email').length || 0;

  if (callCount === 0 && body.recentActivities?.length > 0) {
    tips.push('You haven\'t made any calls recently. Personal conversations move deals forward faster than emails. Schedule some calls today!');
  }

  if (emailCount > callCount && body.recentActivities?.length > 0) {
    tips.push('Balance is key: while emails are good for follow-ups, calls create real relationships. Try to match your call volume to your email volume.');
  }

  const interestedCount = body.recentActivities?.filter((a: any) => a.outcome === 'interested').length || 0;
  if (interestedCount > 0) {
    tips.push(`You have ${interestedCount} prospects marked as interested. Strike while the iron is hot - follow up within 24 hours!`);
  }

  if (tips.length === 0) {
    tips.push('Keep logging your activities and tracking your pipeline. The more data you record, the better coaching insights you\'ll get!');
  }

  return Response.json({ tips });
}
