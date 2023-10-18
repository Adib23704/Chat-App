const output = document.getElementById("output");
const message = document.getElementById("message");
const send = document.getElementById("send");
const feedback = document.getElementById("feedback");
const roomMessage = document.querySelector(".room-message");
const users = document.querySelector(".users");

// eslint-disable-next-line no-undef
const socket = io("http://localhost:8080");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get("username");
const roomname = urlParams.get("roomname");
console.log(username, roomname);

roomMessage.innerHTML = `Connected in room ${roomname}`;

socket.emit("joined-user", {
  username,
  roomname,
});

send.addEventListener("click", () => {
  socket.emit("chat", {
    username,
    message: message.value,
    roomname,
  });
  message.value = "";
});

message.addEventListener("keypress", () => {
  socket.emit("typing", { username, roomname });
});

socket.on("joined-user", (data) => {
  output.innerHTML += `<p>--> <strong><em>${data.username} </strong>has Joined the Room</em></p>`;
});

socket.on("chat", (data) => {
  output.innerHTML += `<p><strong>${data.username}</strong>: ${data.message}</p>`;
  feedback.innerHTML = "";
  document.querySelector(".chat-message").scrollTop =
    document.querySelector(".chat-message").scrollHeight;
});

socket.on("typing", (user) => {
  feedback.innerHTML = `<p><em>${user} is typing...</em></p>`;
});

socket.on("online-users", (data) => {
  users.innerHTML = "";
  data.forEach((user) => {
    users.innerHTML += `<p>${user}</p>`;
  });
});
