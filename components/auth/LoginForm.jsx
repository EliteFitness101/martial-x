"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");

  async function login() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div>
      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}
