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

  chatBox.innerHTML += `<p id="typing">coachB2K typing...</p>`;

  const res = await fetch("/api/coach", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: input, email })
  });

  const data = await res.json();
  document.getElementById("typing").remove();

  chatBox.innerHTML += `<p><b>coachB2K:</b> ${data.reply}</p>`;
}
