import { success } from "@/lib/apiResponse";
import { apiHandler } from "@/lib/apiHandler";
import { generateCoachResponse } from "@/services/coachService";

export const POST = apiHandler(async (req) => {
  const body = await req.json();

  const reply = await generateCoachResponse({
    user: body.user,
    message: body.message,
  });

  return success({ reply }, "coach response generated");
});
