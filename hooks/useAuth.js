import { useState } from "react";

export function useAuth() {
  const [user] = useState({
    id: "demo-user",
    name: "Elite User",
    email: "user@demo.com",
    role: "user",
    subscription: "free",
  });

  return { user };
}
