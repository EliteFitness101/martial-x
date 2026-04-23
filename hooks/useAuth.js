import { useState } from "react";

export function useAuth() {
  const [user] = useState({
    id: "demo",
    name: "User",
  });

  return { user };
}
