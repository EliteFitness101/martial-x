import { success } from "@/lib/apiResponse";
import { apiHandler } from "@/lib/apiHandler";
import { calculateUserScore } from "@/lib/intelligence/userScore";
import { predictChurn } from "@/lib/intelligence/churnPredictor";
import { segmentUser } from "@/lib/intelligence/segmentation";
import { calculateLTV } from "@/lib/intelligence/revenueEngine";

export const POST = apiHandler(async (req) => {
  const { user } = await req.json();

  const score = calculateUserScore(user);
  const churn = predictChurn(user);
  const segment = segmentUser(user);
  const ltv = calculateLTV(user);

  return success({
    score,
    churn,
    segment,
    ltv,
  });
});
