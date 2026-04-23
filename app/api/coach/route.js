export async function POST(req) {
  try {
    const { message, email } = await req.json();

    // 🔐 Check subscription
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
        reply: "🔒 Subscribe to ChatB2K to unlock full coaching."
      });
    }

    const plan = users[0]?.plan || "starter";

    // 🤖 AI
    const ai = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: `
You are ChatB2K, elite Nigerian fitness AI coach.

User plan: ${plan}

Rules:
- Starter → simple advice
- Pro → detailed coaching + nutrition
- Keep answers short
- Motivate and guide toward Martial X

User: ${message}
`
      })
    });

    const data = await ai.json();

    return Response.json({
      reply:
        data.output?.[0]?.content?.[0]?.text ||
        "Stay consistent. Discipline wins."
    });

  } catch (err) {
    console.error(err);

    return Response.json({
      reply: "⚡ Stay consistent. Your progress matters."
    });
  }
}
