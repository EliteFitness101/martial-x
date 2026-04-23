export function calculateUserScore(user) {
  let score = 0;

  // activity score
  score += (user.xp || 0) * 0.5;

  // subscription weight
  if (user.subscription === "elite") score += 50;

  // engagement
  if (user.lastActiveDays < 2) score += 20;
  if (user.lastActiveDays > 7) score -= 30;

  return Math.max(0, score);
}
