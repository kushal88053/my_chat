const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors"); // Import the CORS package

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(
  cors({
    origin: "http://127.0.0.1:8080", // Allow requests from 127.0.0.1
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (you can restrict it to a specific origin)
    methods: ["GET", "POST"],
  },
});

const users = {};

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "../")));

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("receive", {
      message: `${users[socket.id]} has left the chat.`,
      name: "Admin",
    });
    delete users[socket.id];
  });
});

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
