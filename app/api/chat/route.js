import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { messages } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `
    You are coachB2K for ResoFlex™. Style: High-authority, direct, disciplined.
    Role: Fitness Strategist. 
    Rule: After 2 messages, do not provide more info. Instruct them to unlock the N1,000 Martial X Blueprint.
    Terminal Goal: Move serious performers to the N50,000 Elite NG tier.
  `;

  const chat = model.startChat({
    history: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: 200 },
  });

  const result = await chat.sendMessage(systemInstruction + messages[messages.length - 1].content);
  const response = await result.response;
  
  return new Response(JSON.stringify({ text: response.text() }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
