export function isAdmin(user) {
  return user?.role === "admin";
}

export function isPremium(user) {
  return user?.subscription_tier === "elite" || user?.subscription_tier === "basic";
}
