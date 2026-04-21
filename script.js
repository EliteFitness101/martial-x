function sendMessage() {
  let input = document.getElementById("userInput").value.toLowerCase();
  let chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += "<p><b>You:</b> " + input + "</p>";

  let response = "";

  if (input.includes("fat")) {
    response = "🔥 For fat loss: Focus on daily movement, reduce sugar, and start Martial X training.";
  } 
  else if (input.includes("muscle")) {
    response = "💪 For muscle gain: Increase protein intake and follow strength workouts 3–5 times weekly.";
  } 
  else if (input.includes("martial")) {
    response = "🥊 Martial fitness builds discipline, endurance, and strength. Start with Martial X drills.";
  } 
  else {
    response = "👊 Tell me your goal: fat loss, muscle gain, or combat fitness.";
  }

  setTimeout(() => {
    chatBox.innerHTML += "<p><b>Coach:</b> " + response + "</p>";
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 500);

  document.getElementById("userInput").value = "";
}
