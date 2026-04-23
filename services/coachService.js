import { getMemory, saveMemory } from "./memoryService";

export async function generateCoachResponse({
  user,
  message,
  openai,
}) {
  const memory = await getMemory(user.id);

  const context = memory
    .map((m) => `User: ${m.input}\nCoach: ${m.output}`)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an autonomous fitness AI coach.

You remember user history:
${context}

Adapt behavior automatically based on:
- discipline level
- consistency
- emotional tone
- fitness progress
        `,
      },
      { role: "user", content: message },
    ],
  });

  const reply = completion.choices[0].message.content;

  await saveMemory(user.id, message, reply);

  return reply;
}
