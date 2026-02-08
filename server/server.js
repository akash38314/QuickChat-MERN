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

const app = express();
const server = http.createServer(app);

// 1. LIVE URL DEFINITION
// Yahan humne aapka exact live Netlify link dala hai
const allowedOrigins = [
    "http://localhost:5173", 
    "https://aesthetic-klepon-7aa9d7.netlify.app" 
];

// 2. SOCKET SETUP
export const userSocketMap = {}; 
export const io = new Server(server, {
    cors: { 
        origin: allowedOrigins, 
        credentials: true,
        methods: ["GET", "POST"]
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

// 3. Middlewares
app.use(express.json({ limit: "5mb" }));
// CORS Middleware jo frontend requests allow karega
app.use(cors({ 
    origin: allowedOrigins, 
    credentials: true 
}));

// 4. Routes Mount
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