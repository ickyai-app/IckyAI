export async function POST(request) {
  try {
    const { query, accounts } = await request.json();

    // Mock coaching response based on query
    let response = '';

    if (query.toLowerCase().includes('today')) {
      response = 'Your top 3 priorities today:\n\n1. 🎯 Call Celovite storitve (new director) - €150k opportunity\n2. ⚔️ Follow up with Sintal EKO (Miha) - beat TASKI on robots\n3. 📊 Schedule meeting with Aktiva Skupina (expansion budget)';
    } else if (query.toLowerCase().includes('taski')) {
      response = 'How to beat TASKI:\n\n• Our robots are 15% faster\n• Better integration with existing equipment\n• Lower total cost of ownership\n• 24/7 support vs their standard support\n\nKey accounts: Sintal EKO (€200k budget), Aktiva Skupina (€100k expansion)';
    } else if (query.toLowerCase().includes('sintal')) {
      response = 'Sintal EKO Strategy:\n\n📊 Budget: €200k/year\n👤 Contact: Miha Legin (Operations Director)\n🎯 Current: Using Taski robots\n💡 Strategy: Schedule demo showing robot superiority\n🎁 Offer: Volume discount if they switch\n\nExpected close: €40-80k in 30 days';
    } else if (query.toLowerCase().includes('celovite')) {
      response = 'Celovite storitve Opportunity:\n\n⭐ NEW CUSTOMER - €150k available\n👤 New director (name TBD)\n🎯 Strategy: First meeting - introduce full product line\n💡 Focus: They\'re a blank slate, position us as one-stop shop\n📅 Action: Call this week\n\n30-day target: €50k';
    } else if (query.toLowerCase().includes('happy with supplier')) {
      response = 'Response to "Happy with current supplier":\n\n1. "I appreciate that. May I ask which areas of cleaning they handle?"\n2. Listen for gaps (usually pressure washing OR scrubber-driers, not both)\n3. "We actually specialize in [gap area]. Could I show you how we\'re different?"\n4. Schedule quick 15-min demo\n5. Follow up with written proposal\n\nKey: Position us as specialist in their gap, not replacement.';
    } else if (query.toLowerCase().includes('tips')) {
      response = 'Sales Tips for BSC Companies:\n\n✅ Call early (operations calls 6-8am)\n✅ Focus on time savings (demo the difference)\n✅ Get operations manager + finance approval\n✅ ROI case: Scrubber-drier pays for itself in 15 months\n✅ Volume discounts on multiple equipment\n✅ Follow-up 3x before giving up\n✅ Send proposal same day as demo\n\nWin rate improves 300% with these.';
    } else {
      response = 'I\'m your Kärcher sales coach. Ask me about:\n\n• Your 6 Slovenian BSC accounts\n• How to beat TASKI on robots\n• Account-specific strategies\n• Sales tips and closing techniques\n• Your 30-day action plan\n\nExample: "Help me with Sintal EKO"';
    }

    return Response.json({
      coaching: {
        response,
        category: 'ACCOUNT_STRATEGY'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
