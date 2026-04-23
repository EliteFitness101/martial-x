import ChatBox from "@/components/coach/ChatBox";

export default function CoachPage() {
  const user = {
    id: "demo",
    name: "User",
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🤖 AI Coach</h1>
      <ChatBox user={user} />
    </div>
  );
}
