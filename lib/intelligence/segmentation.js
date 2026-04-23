export function segmentUser(user) {
  if (user.subscription === "elite" && user.xp > 200) {
    return "POWER_USER";
  }

  if (user.xp > 100) {
    return "ACTIVE_USER";
  }

  if (user.lastActiveDays > 7) {
    return "CHURN_RISK";
  }

  return "NEW_USER";
}
