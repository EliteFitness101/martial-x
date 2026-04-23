export function calculateLTV(user) {
  const base = user.subscription === "elite" ? 20000 : 2000;
  const multiplier = (user.xp || 0) / 100 + 1;

  return base * multiplier;
}

export function estimateMRR(users) {
  return users.reduce((sum, u) => {
    return sum + (u.subscription === "elite" ? 20000 : 0);
  }, 0);
}
