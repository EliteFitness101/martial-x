export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.9565003:0ee605f297925da83c14ae1fd8436381}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: `You are coachB2K, a Nigerian boxing and fitness coach. Give short, practical advice.\nUser: ${message}`
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "Try again. No response.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
