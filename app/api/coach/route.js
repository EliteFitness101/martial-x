import { NextResponse } from "next/server";
import { buildCoachPrompt } from "@/services/coachService";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();

  const { message, user, personality } = body;

  const prompt = buildCoachPrompt({ personality, user });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message },
    ],
  });

  return NextResponse.json({
    reply: response.choices[0].message.content,
  });
}
