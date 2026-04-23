import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ text: "SYSTEM_ERROR: Key Missing." }), { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are coachB2K, high-authority strategist for ResoFlex™. Style: Direct, disciplined. Do not exceed 2 responses. Direct user to N1,000 Martial X blueprint."
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
    return new Response(JSON.stringify({ 
      text: "Signal interference. Input email to receive the direct protocol link." 
    }), { status: 200 });
  }
}
