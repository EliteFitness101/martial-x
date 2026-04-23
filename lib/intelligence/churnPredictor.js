export function predictChurn(user) {
  let risk = 0;

  if (user.lastActiveDays > 5) risk += 40;
  if ((user.xp || 0) < 50) risk += 30;
  if (user.subscription === "free") risk += 20;

  return {
    riskScore: risk,
    label:
      risk > 60 ? "HIGH_RISK" :
      risk > 30 ? "MEDIUM_RISK" :
      "LOW_RISK",
  };
}
