import { useState } from "react";

export function useCoachChat(user) {
  const [messages, setMessages] = useState([]);

  async function sendMessage(text) {
    const res = await fetch("/api/coach", {
      method: "POST",
      body: JSON.stringify({ message: text, user }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "coach", text: data.reply },
    ]);
  }

  return { messages, sendMessage };
}
