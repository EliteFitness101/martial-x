import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ text: "ERROR: Critical System Key Missing." }), { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are coachB2K, a high-authority fitness strategist for ResoFlex™. Style: Direct, disciplined, Nigerian-market savvy. Goal: Audit user roadblocks and move them to the ₦1,000 Martial X blueprint. Do not provide more than 2 free responses."
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;

    return new Response(JSON.stringify({ text: response.text() }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DEPLOYMENT ERROR:", error);
    return new Response(JSON.stringify({ 
      text: "Signal interference. Protocol demands a more stable connection. Input your email below to receive the blueprint directly." 
    }), { status: 200 });
  }
}
