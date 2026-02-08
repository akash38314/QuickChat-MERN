import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

// Router Imports
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

dotenv.config();

// 1. App aur Server Define karein (Sequence fix)
const app = express();
const server = http.createServer(app);

// 2. SOCKET SETUP (Exporting 'io' is the key fix)
export const userSocketMap = {}; 
export const io = new Server(server, {
    cors: { 
        origin: ["http://localhost:5173", "https://your-app.netlify.app"], 
        credentials: true 
    }
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

// 3. Middlewares (app define hone ke BAAD)
app.use(express.json({ limit: "5mb" }));
app.use(cors({ 
    origin: ["http://localhost:5173", "https://your-app.netlify.app"], 
    credentials: true 
}));

// 4. Routes Mount karein
app.use("/api/auth", userRouter);      
app.use("/api/messages", messageRouter); 

// 5. DB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 6. Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});