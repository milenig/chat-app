const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();

// Get username from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Display message sent from server
socket.on("message", (message) => {
  outputMessage(message);

  // Fix scroll -> scroll down for every message -> see last message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get value of input with id "msg"
  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit("chatMessage", msg);

  // clear input after sending message
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  if (message.username == username) {
    div.classList.add("current");
  }
  div.innerHTML = `<div class="avatar ${
    message.username == "bot" ? "bot" : ""
  }">
    ${message.username.charAt(0)}
  </div>
  <div class="text-container ${message.username == "bot" ? "bot" : ""}">
    <p class="text">
        ${message.text}
    </p>
    <p class="meta"><span class="time">${
      message.time
    }</span>&#183;<span class="name">${message.username}</span></p>
  </div>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
        ${users.map((user) => `<li><h2>${user.username}</h2></li>`).join("")}
    `;
}
