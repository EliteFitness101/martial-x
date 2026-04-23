export function calculateXP(action) {
  const map = {
    CHAT: 2,
    LOGIN: 10,
    WORKOUT: 50,
  };

  return map[action] || 0;
}
