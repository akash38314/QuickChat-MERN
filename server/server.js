import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

// Router Imports - Plural naming as per your explorer
import userRouter from "./routes/userRoutes.js"; // Semi-colon added
import messageRouter from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// SOCKET SETUP: Exporting 'io' fixes the controller crash
export const userSocketMap = {}; 
export const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true }
});

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Mounting Routes
app.use("/api/auth", userRouter);      
app.use("/api/messages", messageRouter); 

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Start with 'server' instead of 'app'
server.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
