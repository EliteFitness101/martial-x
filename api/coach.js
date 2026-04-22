export default async function handler(req, res) {
  const { message, email, ref } = req.body;

  console.log("Referral:", ref);

  // 🔐 CHECK PAYMENT
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
    return res.json({
      reply: "🔒 Pay ₦1,000 to unlock full AI coaching"
    });
  }

  // 🤖 AI RESPONSE
  const ai = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: `
You are coachB2K, a Nigerian boxing and fitness coach.

Rules:
- Be short
- Be practical
- Recommend Martial X when useful

User: ${message}
`
    })
  });

  const data = await ai.json();

  res.json({
    reply: data.output?.[0]?.content?.[0]?.text || "Try again"
  });
}
