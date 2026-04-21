export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.9565003:0ee605f297925da83c14ae1fd8436381}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: `You are a professional Nigerian fitness coach. Give short, practical advice.\nUser: ${message}`
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.output[0].content[0].text
    });

  } catch (error) {
    res.status(500).json({ error: "AI error" });
  }
}
