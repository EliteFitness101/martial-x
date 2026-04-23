import { success, error } from "@/lib/apiResponse";
import { apiHandler } from "@/lib/apiHandler";
import { rateLimit } from "@/lib/rateLimiter";
import { trackRequest, trackFailure } from "@/lib/metrics";
import { withRetry } from "@/lib/retry";
import { fallbackResponse } from "@/lib/fallbackAI";
import { generateCoachResponse } from "@/services/coachService";

export const POST = apiHandler(async (req) => {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // 🛡️ RATE LIMIT CHECK
  if (!rateLimit(ip)) {
    return error("Too many requests. Slow down.", 429);
  }

  trackRequest();

  const body = await req.json();

  try {
    // 🔁 RETRY SAFE AI CALL
    const reply = await withRetry(() =>
      generateCoachResponse({
        user: body.user,
        message: body.message,
      })
    );

    return success({ reply }, "coach response");
  } catch (err) {
    trackFailure();

    // 🧠 FALLBACK AI RESPONSE
    return success(
      { reply: fallbackResponse(body.message) },
      "fallback response"
    );
  }
});
