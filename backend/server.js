const express = require("express");
const { createServer } = require("node:http");
const {
  deleteChat,
  joinChat,
  createChat,
  deleteMessage,
  updateChat,
  typing,
  updateMessage,
  createMessage
} = require("./socket/handlers");

const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const allowedOrigins = require("./config/allowedOrgin");

const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

const { socketAuthHandler } = require("./middleware/socketAuthHandler");

const path = require("node:path");
const server = createServer(app);
const io = new Server(server, { cors: { origin: allowedOrigins } });

const PORT = process.env.PORT || 3000;

io.use(socketAuthHandler);

io.on("connection", (socket) => {
  socket.on("chat-created", createChat( socket));
  socket.on("chat-updated", updateChat( socket));
  socket.on("join-chat", joinChat(socket));
  socket.on("edit-message",updateMessage(io,socket));
  socket.on("delete-message", deleteMessage(io, socket));

  socket.on("delete-chat", deleteChat(io));
  socket.on("typing",typing(socket));

  socket.on("message", createMessage(io,socket));
});

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

// app.use(logger);
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/register", require("./routes/register"));
app.use(verifyJWT);
app.use("/api/users", require("./routes/user"));
app.use("/api/chats", require("./routes/chatGroup"));
app.use("/api/messages", require("./routes/chatMessage"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);
server.listen(PORT, () =>
  console.log(`App is running on port http://localhost:${PORT}`)
);
