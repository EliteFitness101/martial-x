export async function POST(req) {
  const { message, email } = await req.json();

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

  if (!users.length) {
    return Response.json({
      reply: "🔒 Pay ₦1,000 to unlock ChatB2K full coaching."
    });
  }

  const ai = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: `
You are ChatB2K, an elite Nigerian boxing and fitness AI coach.

Rules:
- Keep answers under 2 sentences
- Be practical
- Motivate user
- Recommend Martial X

User: ${message}
`
    })
  });

  const data = await ai.json();

  return Response.json({
    reply: data.output?.[0]?.content?.[0]?.text || "Stay consistent and disciplined."
  });
}
