const socket = io("http://localhost:8080");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

let user_name = prompt("Enter your name");
socket.emit("new-user-joined", user_name);

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`Me: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = ""; // Clear input after sending
});

// Listen for messages from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});

socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});
