import { NextResponse } from "next/server";
import OpenAI from "openai";
import { generateCoachResponse } from "@/services/coachService";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();

  const reply = await generateCoachResponse({
    user: body.user,
    message: body.message,
    openai,
  });

  return NextResponse.json({ reply });
}
