import express from "express";
import { protectRoute } from "../middleware/auth.js"; // Security middleware
import { 
    getMessages, 
    getUsersForSidebar, 
    markMessageAsSeen, 
    sendMessage 
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// 1. Sidebar ke liye users list fetch karna
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// 2. Specific user ke saath saari messages load karna
messageRouter.get("/:id", protectRoute, getMessages);

// 3. Messages ko 'seen' mark karna (Badge logic ke liye)
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// 4. Naya message bhejna (Text + Image support)
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;