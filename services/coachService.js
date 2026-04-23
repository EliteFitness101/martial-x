import { COACH_PERSONALITIES } from "@/lib/constants";

export function buildCoachPrompt({ personality, user }) {
  const baseContext = `
You are an elite AI fitness coach inside a SaaS platform.

User:
- Name: ${user?.name || "User"}
- Goal: ${user?.goal || "General Fitness"}
- Level: ${user?.level || "Beginner"}
`;

  const styles = {
    [COACH_PERSONALITIES.STRICT]:
      "Be strict, no excuses, discipline-focused.",
    [COACH_PERSONALITIES.MOTIVATIONAL]:
      "Be highly motivational, positive energy.",
    [COACH_PERSONALITIES.MILITARY]:
      "Be intense, tactical, command-based training style.",
    [COACH_PERSONALITIES.THERAPEUTIC]:
      "Be calm, supportive, emotional recovery focused.",
  };

  return `${baseContext}\nStyle: ${styles[personality] || styles.MOTIVATIONAL}`;
}
