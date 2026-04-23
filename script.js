// 🔗 Referral
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get("ref") || "direct";

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

  if (messageCount > 2) {
    chatBox.innerHTML += `
      <p style="color:gold">🔒 Unlock full AI for ₦1,000</p>
      <a href="https://paystack.com/buy/martial-x">👉 Pay Now</a>
    `;
    return;
  }

  chatBox.innerHTML += `<p id="typing">ChatB2K typing...</p>`;

  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: input, email, ref })
    });

    const data = await res.json();
    document.getElementById("typing").remove();

    chatBox.innerHTML += `<p><b>ChatB2K:</b> ${data.reply}</p>`;
  } catch {
    document.getElementById("typing").remove();
    chatBox.innerHTML += `<p style="color:red;">Network error</p>`;
  }
}
