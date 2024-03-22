const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const io = new Server();
const app = express();

app.use(bodyParser.json());

const emailToSocketMapping = new Map();

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    console.log("User", emailId, "joined room", roomId);
    emailToSocketMapping.set(emailId, socket.id);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", emailId);
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
io.listen(8001);
