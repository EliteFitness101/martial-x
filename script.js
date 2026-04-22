// =============================
// 🔗 REFERRAL TRACKING
// =============================
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get("ref") || "direct";

// =============================
// 🤖 AI SYSTEM
// =============================
let messageCount = 0;

async function sendMessage() {
  const input = document.getElementById("userInput").value;
  const email = document.getElementById("emailInput").value;
  const chatBox = document.getElementById("chatBox");

  if (!email) {
    alert("Enter your email first");
    return;
  }

  messageCount++;

  chatBox.innerHTML += `<p><b>You:</b> ${input}</p>`;

  // 🔒 LOCK AFTER 2 MESSAGES
  if (messageCount > 2) {
    chatBox.innerHTML += `
      <p style="color:gold">
        🔥 You’re 1 step away from your transformation
      </p>
      <a href="https://paystack.com/buy/martial-x">
        👉 Unlock Full Program – ₦1,000
      </a>
    `;
    return;
  }

  chatBox.innerHTML += `<p id="typing">coachB2K typing...</p>`;

  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: input,
        email: email,
        ref: ref
      })
    });

    const data = await res.json();

    document.getElementById("typing").remove();

    chatBox.innerHTML += `<p><b>coachB2K:</b> ${data.reply}</p>`;

  } catch (error) {
    document.getElementById("typing").remove();
    chatBox.innerHTML += `<p style="color:red;">Network error</p>`;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
