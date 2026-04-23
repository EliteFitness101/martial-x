import { XP_RULES } from "@/lib/constants";

export function calculateXP(action) {
  return XP_RULES[action] || 0;
}

export function levelFromXP(xp) {
  return Math.floor(xp / 100);
}
