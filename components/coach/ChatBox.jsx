"use client";

import { useState } from "react";
import { useCoachChat } from "@/hooks/useCoachChat";

export default function ChatBox({ user }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useCoachChat(user);

  return (
    <div>
      <div style={{ height: 300, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={() => {
          sendMessage(input);
          setInput("");
        }}
      >
        Send
      </button>
    </div>
  );
}
