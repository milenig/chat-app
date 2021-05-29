const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder -> connect current directory and public folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects -> listen for event "connection"
io.on("connection", (socket) => {
  console.log("New WS Connection...");

  // Send message from server -> Welcome single client that connecting
  socket.emit("message", "Welcome to Chat application :)");

  // Broadcast when a user connects -> emit to everyone, not including client that's connecting
  socket.broadcast.emit("message", "A user has joind the chat");

  // Runs when client disconnects
  socket.on("disconnect", () => {
    // Emit to everyone
    io.emit("message", "A user has left the chat");
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    // emit back to client -> everybody
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;

// Run server on port
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
