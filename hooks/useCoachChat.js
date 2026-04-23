export function useCoachChat(user) {
  async function sendMessage(text) {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, user }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data.reply;
  }

  return { sendMessage };
}
