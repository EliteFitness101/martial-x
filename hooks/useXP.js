import { useState } from "react";

export function useXP() {
  const [xp, setXP] = useState(0);

  function addXP(amount) {
    setXP((prev) => prev + amount);
  }

  function level() {
    return Math.floor(xp / 100);
  }

  return { xp, addXP, level };
}
