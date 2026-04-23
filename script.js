// 🔗 Referral
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get("ref") || "direct";

let messageCount = 0;

// 🧠 Keyword fallback responses
function fallbackReply(input) {
  input = input.toLowerCase();

  if (input.includes("lose weight") || input.includes("fat")) {
    return "🔥 For fat loss: focus on daily movement + clean meals. Martial X accelerates this with combat workouts.";
  }

  if (input.includes("build muscle") || input.includes("gain")) {
    return "💪 Build muscle with resistance training + protein-rich Nigerian meals. Martial X covers both.";
  }

  if (input.includes("belly") || input.includes("abs")) {
    return "⚡ Belly fat drops when you combine cardio + discipline. Martial X is designed exactly for this.";
  }

  if (input.includes("how") || input.includes("start")) {
    return "🚀 Start simple: 20–30 mins daily. Martial X gives you a structured plan instantly.";
  }

  return "🔥 Stay consistent. Discipline beats motivation. Martial X will guide your transformation.";
}

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

  // 🔒 PAYWALL
  if (messageCount > 2) {
    chatBox.innerHTML += `
      <p style="color:gold">🔒 Unlock full ChatB2K for ₦1,000</p>
      <a href="https://paystack.com/buy/martial-x">👉 Start Now</a>
    `;
    return;
  }

  chatBox.innerHTML += `<p id="typing">ChatB2K is analyzing...</p>`;

  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: input, email, ref })
    });

    const data = await res.json();
    document.getElementById("typing").remove();

    chatBox.innerHTML += `<p><b>ChatB2K:</b> ${data.reply}</p>`;

  } catch (error) {
    document.getElementById("typing").remove();

    // 🧠 FALLBACK RESPONSE
    const fallback = fallbackReply(input);

    chatBox.innerHTML += `
      <div style="background:#111;padding:10px;border-radius:10px;margin-top:10px">
        <p><b>ChatB2K:</b> ${fallback}</p>
        <p style="color:#888;font-size:12px">⚡ Smart Assist Mode</p>
      </div>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
