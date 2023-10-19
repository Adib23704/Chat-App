const { getUsers, users } = require("./users");

function connection(io) {
  io.on("connection", (socket) => {
    socket.on("joined-user", (data) => {
      const user = {};
      user[socket.id] = data.username;
      if (users[data.roomname]) {
        users[data.roomname].push(user);
      } else {
        users[data.roomname] = [user];
      }

      socket.join(data.roomname);

      io.to(data.roomname).emit("joined-user", { username: data.username });

      io.to(data.roomname).emit("online-users", getUsers(users[data.roomname]));
    });

    socket.on("chat", (data) => {
      io.to(data.roomname).emit("chat", {
        username: data.username,
        message: data.message,
      });
    });

    socket.on("typing", (data) => {
      socket.broadcast.to(data.roomname).emit("typing", data.username);
    });

    socket.on("exit-room", (data) => {
      const socketId = socket.id;
      const {username, roomname} = data;
      
      console.log("Socket ID:", socketId);
      console.log("Roomname:", roomname);
    
      if (users[roomname]) {
        const userIndex = users[roomname].findIndex((user) => user[socketId]);
        console.log("User Index:", userIndex);
        
        if (userIndex !== -1) {
          users[roomname].splice(userIndex, 1);
          io.to(roomname).emit("online-users", getUsers(users[roomname]));
          io.to(roomname).emit("exit-message", { username, message: "has left the room." });
        }
      }
    });    
  });
}

module.exports = connection;
