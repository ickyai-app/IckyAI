import { NextResponse } from 'next/server';

// Slovenian BSC Accounts Knowledge Base
const ACCOUNTS_KNOWLEDGE = {
  'celovite-storitve': {
    name: 'Celovite storitve',
    budget: 150000,
    status: 'NOT_USING_US',
    contact: 'New director',
    competitors: 'Unknown',
    opportunity: 'NET NEW €150k',
    priority: 'CRITICAL',
    strategy: 'First contact with new director - blank slate opportunity',
    pitch: 'Congratulations on the new role! I work with major BSC companies in Slovenia managing their cleaning equipment. Can I show you what Kärcher can do for you?'
  },
  'sintal-eko': {
    name: 'Sintal EKO',
    budget: 200000,
    status: 'LOSING_TO_TASKI',
    contact: 'Miha Legin, Operations Director',
    currentKarcher: 'Vacuum cleaners + SGG',
    competitors: 'TASKI (robots)',
    opportunity: 'Replace TASKI robots with Kärcher robots - €40-80k',
    priority: 'HIGH',
    strategy: 'Demo Kärcher robot vs TASKI - show superiority',
    pitch: 'Miha, I know you\'re looking at robots. TASKI is good, but Kärcher robots are better for your facility type. Let me show you the difference in 30 minutes.'
  },
  'aktiva-skupina': {
    name: 'Aktiva Skupina',
    budget: 100000,
    status: 'PARTIAL_USER',
    contact: 'Katja Meserič, Operations Manager',
    currentKarcher: 'KIRA CV 50 (robot), carpet vacuums',
    competitors: 'TASKI',
    opportunity: 'Robotics expansion - €50-80k',
    priority: 'HIGH',
    strategy: 'Call NOW before they expand TASKI contract',
    pitch: 'Katja, I see you\'re expanding your robot fleet. Since you already have KIRA and love it, let\'s talk about expanding with more Kärcher equipment instead of mixing in competitors.'
  },
  'modri-val': {
    name: 'Modri Val',
    budget: 100000,
    status: 'PARTIAL_USER',
    contact: 'Anže Vovčko (OWNER)',
    currentKarcher: 'High pressure washers ONLY',
    competitors: 'PanGoslar (Chinese), TASKI',
    opportunity: 'Consolidation - become one-stop shop - €30-40k',
    priority: 'MEDIUM-HIGH',
    strategy: 'Consolidate from 3 vendors to 1 = save €10k + simplicity',
    pitch: 'Anže, you\'re working with 3 different suppliers. Let\'s consolidate with Kärcher - better pricing, one contact, simpler invoicing.'
  },
  'ees-sistemi': {
    name: 'EES Sistemi',
    budget: 100000,
    status: 'PARTIAL_USER',
    contact: 'Lidija Kobal, Operations Manager',
    currentKarcher: 'Backpack vacuum cleaners ONLY',
    competitors: 'Klintek (TASKI), Ruby brand',
    opportunity: 'Upgrade to full equipment line - €20-30k',
    priority: 'MEDIUM',
    strategy: 'Demo missing equipment categories (scrubber-driers, etc)',
    pitch: 'Lidija, I see you\'re only using backpack vacs from us. You\'re missing out on our scrubber-driers and industrial equipment that could save you time.'
  },
  'bn-facilities': {
    name: 'B+N Facilities',
    budget: 100000,
    status: 'GOOD_CUSTOMER',
    contact: 'Urša, Purchasing Manager',
    currentKarcher: 'Wide range (sweepers, small scrubber-driers, vacuums)',
    competitors: 'Minimal',
    opportunity: 'Upsell as they grow - €10-15k',
    priority: 'MEDIUM',
    strategy: 'Quarterly business reviews, suggest upgrades',
    pitch: 'Urša, let\'s do a quarterly check-in. I want to make sure you\'re getting the best performance from your equipment and find opportunities to optimize.'
  }
};

// AI Coaching Engine
function getCoachResponse(query, allAccounts = []) {
  const lowerQuery = query.toLowerCase();
  
  // Get today's priorities
  if (lowerQuery.includes('priority') || lowerQuery.includes('what should i do') || lowerQuery.includes('today')) {
    return {
      category: 'PRIORITIES',
      response: `🎯 **Today's Top 3 Priorities (Feb 2, 2026):**

**CRITICAL - This Week:**
1. **Celovite storitve** (€150k NET NEW) - Call new director
   - They use ZERO Kärcher right now
   - Pitch: "Congratulations on role! I help BSC companies manage cleaning equipment. Can I show you what Kärcher offers?"
   - Goal: Get 30-min discovery meeting this week

2. **Sintal EKO** (€200k budget, LOSING TO TASKI)
   - Contact: Miha Legin, Operations Director
   - They like our vacs but choosing TASKI robots
   - Pitch: "Miha, let me show you why Kärcher robots outperform TASKI on your facility type"
   - Goal: Schedule robot demo comparison

3. **Aktiva Skupina** (€100k + expansion budget)
   - Contact: Katja Meserič, Operations Manager
   - They have KIRA robot (love it!) but considering TASKI expansion
   - Pitch: "Let's expand your robot fleet with Kärcher instead of mixing in competitors"
   - Goal: Expansion discussion meeting

**Revenue Target:** €150-200k this month from these 3 accounts alone.

Next steps?`,
      accounts: ['celovite-storitve', 'sintal-eko', 'aktiva-skupina']
    };
  }
  
  // Competitive coaching
  if (lowerQuery.includes('taski') || lowerQuery.includes('beat') || lowerQuery.includes('compete')) {
    return {
      category: 'COMPETITIVE_STRATEGY',
      response: `⚔️ **How to Beat TASKI (Your #1 Competitor)**

**TASKI Strengths:**
- Robots (their main selling point)
- Aggressive pricing

**YOUR ADVANTAGES:**
- Kärcher robots are MORE RELIABLE than TASKI
- Better customer support in Slovenia
- Complete equipment line (not just robots)
- Long-term cost of ownership is lower

**WHERE TASKI IS WINNING (Your Accounts):**
1. **Sintal EKO** - They convinced Miha that robots = future
2. **Aktiva Skupina** - Trying to expand robot fleet
3. **Modri Val** - Considering TASKI for consolidation
4. **EES Sistemi** - Mixed equipment with TASKI brand

**YOUR STRATEGY BY ACCOUNT:**

**Sintal EKO (€40-80k opportunity):**
- Call: "Miha, you're smart to think robots. But TASKI has limitations on [SPECIFIC FLOOR TYPE]. Let me show you a demo where Kärcher clearly wins."
- Demo focus: Performance on YOUR facility type (not generic demo)
- Win metric: Better uptime, faster cleaning, lower maintenance

**Aktiva Skupina (€50-80k opportunity):**
- They already have KIRA = competitive advantage for you
- Pitch: "Katja, you picked KIRA because it's the best. Let's not mix in TASKI and complicate your operations."
- Win metric: Simplicity + standardization on one brand

**Modri Val (€30-40k opportunity - price-sensitive):**
- Anže cares about COST + SIMPLICITY
- Your pitch: "One vendor saves you €10k/year vs managing 3 suppliers"
- Win metric: Consolidation savings + single point of contact

**EES Sistemi (€20-30k opportunity):**
- They respect what they know (our backpack vacs)
- Pitch: "Your backpack vacs are great. Now let me show you the equipment you're missing in other categories"
- Win metric: Expand wallet share from backpack-only to full suite

**THE CLOSING ARGUMENT (Use this when they hesitate):**
> "I understand TASKI looks good on paper. But here's what I've seen: companies that mix brands spend more time managing suppliers than managing cleaning. One brand, one support number, better uptime. That's worth it."`,
      accounts: ['sintal-eko', 'aktiva-skupina', 'modri-val', 'ees-sistemi']
    };
  }
  
  // Account-specific coaching
  for (const [key, account] of Object.entries(ACCOUNTS_KNOWLEDGE)) {
    if (lowerQuery.includes(account.name.toLowerCase()) || lowerQuery.includes(key)) {
      return {
        category: 'ACCOUNT_COACHING',
        response: `📊 **${account.name} Strategy**

**Quick Facts:**
- Budget: €${(account.budget / 1000).toFixed(0)}k/year
- Contact: ${account.contact}
- Status: ${account.status}
- Priority: ${account.priority}

**Current Situation:**
${account.currentKarcher ? `- Current Kärcher: ${account.currentKarcher}` : '- NOT using Kärcher'}
${account.competitors ? `- Competitors: ${account.competitors}` : ''}

**Your Opportunity:** ${account.opportunity}

**Recommended Pitch:**
> "${account.pitch}"

**Strategy:**
${account.strategy}

**This Week's Action:**
1. Call/Email: "${account.contact}"
2. Lead with: "${account.pitch}"
3. Goal: Get 30-min discovery meeting
4. If they say yes: Ask about their current equipment, budget, pain points
5. If they hesitate: "No commitment, just want to introduce Kärcher capabilities"

**30-Day Revenue Target:** €${(account.budget * 0.15 / 1000).toFixed(0)}k (this account)
**6-Month Revenue Target:** €${(account.budget * 0.5 / 1000).toFixed(0)}k (grow share from 20-30% to 50-70%)

Questions about approach?`,
        account: key
      };
    }
  }
  
  // Objection handling
  if (lowerQuery.includes('objection') || lowerQuery.includes('they said') || lowerQuery.includes('what if')) {
    return {
      category: 'OBJECTION_HANDLING',
      response: `🛡️ **Common Objections & Your Responses**

**Objection: "TASKI is cheaper"**
Your Response: "You're right, TASKI has aggressive pricing. But let's look at total cost - TASKI breaks down more often, you spend more on repairs and downtime. Kärcher costs more upfront but saves you €10-20k/year in maintenance and downtime. Want to see the math?"

**Objection: "We're happy with our current supplier"**
Your Response: "I'm glad! I'm not asking you to switch everything overnight. I'm asking you to try one product category with Kärcher. If it outperforms, we expand. If not, no hard feelings. Fair?"

**Objection: "We need to think about it"**
Your Response: "Totally fair. How about this - let me send you a brief comparison and a time to do a 30-minute demo. If it's not interesting, you say no. If it is, we go from there. Sound good?"

**Objection: "Your equipment is too expensive"**
Your Response: "I get it - everyone's budget is tight. What if I could show you how Kärcher saves you €15k/year vs what you're currently paying across all your suppliers? Would that be worth 30 minutes?"

**Objection: "Decision is above my head"**
Your Response: "Understood! Who makes the equipment decisions? Can I set up a brief call with [THEM] and you together? I just want to present one option. If they're not interested, no problem."

**Objection: "We have a 2-year contract with [COMPETITOR]"**
Your Response: "I understand. When does that contract end? In the meantime, can we at least talk about what equipment categories might open up sooner? I don't want to waste your time, but I also don't want to miss opportunities."`,
    };
  }
  
  // General sales tips
  if (lowerQuery.includes('how do i') || lowerQuery.includes('tip') || lowerQuery.includes('advice')) {
    return {
      category: 'SALES_TIPS',
      response: `💡 **Pro Sales Tips for Kärcher BSC Sales**

**The Setup Call:**
- Spend 70% listening, 30% talking
- Ask: "What equipment are you using?" "What's your biggest pain point?" "What's your budget?"
- DON'T pitch yet - just gather info

**The Demo:**
- Show on THEIR equipment type (not generic)
- Highlight time-saving (biggest ROI for BSC companies)
- Let them feel the quality difference
- Get them to say "Wow, this is better"

**The Objection Response:**
- Never argue - agree first ("You're right...")
- Then reframe ("...and here's why it doesn't apply here")
- Example: "You're right, TASKI is cheaper. AND total cost is lower with Kärcher because..."

**The Close:**
- Get commitment for next step (not the deal on first call)
- "Should we schedule a demo?" (not "Do you want to buy?")
- If they stall: "What would it take to move forward?"

**The Follow-Up:**
- Every 3-5 days (not too much, not too little)
- Reference what they said last call: "You mentioned cleaning efficiency was #1..."
- Provide value each time (article, case study, comparison sheet)

**The Mindset:**
- You're not selling pumps and brushes
- You're selling TIME SAVINGS and RELIABILITY
- Most Slovenian BSC companies are understaffed
- Your equipment saves them staffing costs = they make MORE PROFIT

Use that framing.`,
    };
  }
  
  // Default response
  return {
    category: 'GENERAL',
    response: `🤖 **AI Sales Coach for Icky**

I'm your personal sales coach for Kärcher in Slovenia. I have deep knowledge of your 6 key Slovenian BSC accounts:

1. **Celovite storitve** (€150k - NET NEW!)
2. **Sintal EKO** (€200k - TASKI battle)
3. **Aktiva Skupina** (€100k + expansion)
4. **Modri Val** (€100k - consolidation)
5. **EES Sistemi** (€100k - product gap)
6. **B+N Facilities** (€100k - upsell)

**Total opportunity: €750k/year**

**What you can ask me:**
- "What should I do today?" → Priorities
- "How do I beat TASKI?" → Competitive strategy
- "Help me with Sintal EKO" → Account-specific coaching
- "What do I say if they object?" → Objection handling
- "Give me sales tips" → Pro advice

**Or just chat:** Ask me anything about sales strategy, pitches, objection handling, or these accounts.

What would help you most right now?`
  };
}

export async function POST(request) {
  try {
    const { query, accounts } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Get AI coaching response
    const coaching = getCoachResponse(query, accounts || []);

    return NextResponse.json({
      success: true,
      coaching,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Coach error:', error);
    return NextResponse.json(
      { error: 'Failed to get coaching response' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Sales Coach API',
    endpoints: {
      POST: '/api/ai-coach - Get coaching response',
      body: { query: 'string', accounts: 'array (optional)' }
    },
    availableQuestions: [
      'What should I do today?',
      'How do I beat TASKI?',
      'Help me with Sintal EKO',
      'What do I say if they object?',
      'Give me sales tips'
    ]
  });
}
