const output = document.getElementById("output");
const message = document.getElementById("message");
const send = document.getElementById("send");
const feedback = document.getElementById("feedback");
const roomMessage = document.querySelector(".room-message");
const users = document.querySelector(".users");
const exitButton = document.getElementById("exit-room");

// eslint-disable-next-line no-undef
const socket = io("https://chatapp-adib.vercel.app");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get("username");
const roomname = urlParams.get("roomname");

roomMessage.innerHTML = `Connected in room <b>${roomname}</b>`;

socket.emit("joined-user", {
  username,
  roomname,
});

send.addEventListener("click", () => {
  if (message.value.trim() !== "") {
    socket.emit("chat", {
      username,
      message: message.value,
      roomname,
    });
    message.value = "";
    message.focus();
    send.setAttribute("disabled", "true");
  }
});

exitButton.addEventListener("click", () => {
  window.location.href = "/";
  socket.emit("exit-room", {
    username,
    roomname,
  });
});

message.addEventListener("keypress", () => {
  socket.emit("typing", { username, roomname });
});

message.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.key === "Enter") {
    send.click(); // Trigger a click on the "Send" button
  }
});

socket.on("joined-user", (data) => {
  output.innerHTML += `<p>--> <strong><em>${data.username} </strong>has Joined the Room</em></p>`;
});

socket.on("exit-message", (data) => {
  if (data.username !== username) {
    output.innerHTML += `<p><strong>${data.username}</strong> ${data.message}</p>`;
    document.querySelector(".chat-message").scrollTop =
      document.querySelector(".chat-message").scrollHeight;
  }
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
    users.innerHTML += `<p>- ${user}</p>`;
  });
});

message.addEventListener("input", () => {
  if (message.value.trim() !== "") {
    send.removeAttribute("disabled");
  } else {
    send.setAttribute("disabled", "true");
  }
});
