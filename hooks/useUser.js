import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser({
      id: "demo",
      name: "Elite User",
      xp: 120,
      level: 2,
      subscription: "free",
    });
  }, []);

  return { user };
}
