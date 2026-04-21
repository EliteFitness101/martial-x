// =============================
// 🤖 COACH B2K AI SCRIPT
// =============================

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  let message = inputField.value.trim();

  if (!message) return;

  // Display user message
  chatBox.innerHTML += `
    <p><b>You:</b> ${message}</p>
  `;

  // Clear input
  inputField.value = "";

  // Show loading state
  chatBox.innerHTML += `
    <p id="typing"><b>coachB2K:</b> typing...</p>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/api/coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // Remove typing indicator
    document.getElementById("typing").remove();

    // Display AI response
    chatBox.innerHTML += `
      <p><b>coachB2K:</b> ${data.reply}</p>
    `;

  } catch (error) {
    document.getElementById("typing").remove();

    chatBox.innerHTML += `
      <p style="color:red;"><b>coachB2K:</b> Network error. Try again.</p>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}


// =============================
// ⌨️ ENTER KEY SUPPORT
// =============================
document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("userInput");

  if (inputField) {
    inputField.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
});
