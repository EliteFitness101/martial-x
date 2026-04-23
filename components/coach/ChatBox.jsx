"use client";

import { useState } from "react";
import { useCoachChat } from "@/hooks/useCoachChat";

export default function ChatBox({ user }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { messages, sendMessage } = useCoachChat(user);

  async function handleSend() {
    if (!input.trim()) return;

    setLoading(true);
    await sendMessage(input);
    setInput("");
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div
        style={{
          height: 400,
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: 10,
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{m.role === "user" ? "You" : "Coach"}:</b> {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your coach..."
          style={{ flex: 1, padding: 10 }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          style={{ padding: 10 }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
