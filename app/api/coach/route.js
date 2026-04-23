export async function POST(req) {
  try {
    const { message, email } = await req.json();

    // 1. Check Supabase for active subscription
    const check = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/customers?email=eq.${email}`,
      {
        headers: {
          apikey: process.env.SUPABASE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_KEY}`
        }
      }
    );

    const users = await check.json();

    if (!users.length || users[0].status !== "active") {
      return Response.json({
        reply: "🔒 Access Restricted. Subscribe to ChatB2K to unlock your elite coaching."
      });
    }

    const plan = users[0]?.plan || "starter";

    // 2. Call OpenAI / Gemini
    const ai = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Use gpt-4o-mini for speed/cost
        messages: [{
          role: "system",
          content: `You are ChatB2K, an elite Nigerian fitness AI coach. User plan: ${plan}. Rules: Keep it short, motivating, and guide them toward Martial X performance.`
        }, {
          role: "user",
          content: message
        }]
      })
    });

    const data = await ai.json();
    const replyText = data.choices[0].message.content;

    return Response.json({ reply: replyText });

  } catch (err) {
    return Response.json({ reply: "⚡ System pulse detected. Stay focused and push harder." });
  }
}
