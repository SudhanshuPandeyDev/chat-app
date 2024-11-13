const express = require("express");
const app = express();

// Express on its own is designed for handling HTTP requests and responses, not WebSocket connections so we need htttp server
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

//  creating an HTTP server that uses an Express application (app) as the request handler
const server = http.createServer(app);

// Creating a Socket.IO server that listens for real-time events on an existing HTTP server,
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected : ${socket.id}`);

  // the message in (message) => { ... } is the data sent by the client when it emitted the "send-message" event.
  socket.on("send-message", (message) => {
    // Broadcast the received message to all the connected users
    io.emit("received-message", message)
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("server running at port 5000");
});
