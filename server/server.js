import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
// import connectDB from "./lib/db.js";
import authRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { Server } from "socket.io";

// create express server and http server
const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
export const userSocketMap = {}; // {userId:socketId}

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connected ", userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // emit online users to all connected clients
  io.emit("getOnlineUsers",Object.keys(userSocketMap))

  socket.on("disconnect",()=>{
    console.log("User disconnected ",userId)
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
  })
});

// middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

await connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});