import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

// FIX: index.js ki jagah server.js se import karein kyunki aapki main file server.js hai
import { io, userSocketMap } from "../server.js"; 

// 1. Sidebar Users + Unseen Count (Optimized)
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        // Saare users fetch karein (except self)
        const users = await User.find({ _id: { $ne: userId } }).select("-password");

        // MongoDB Aggregation pipeline se saare unseen counts ek baar mein nikaalein
        const unseenCounts = await Message.aggregate([
            {
                $match: {
                    receiverId: userId,
                    seen: false
                }
            },
            {
                $group: {
                    _id: "$senderId",
                    count: { $sum: 1 }
                }
            }
        ]);

        const unseenMessages = {};
        unseenCounts.forEach(item => {
            unseenMessages[item._id] = item.count;
        });

        res.status(200).json({ success: true, users, unseenMessages });
    } catch (error) {
        console.error("Error in getUsersForSidebar:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// 2. Chat History fetch karna aur 'seen' status update karna
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        }).sort({ createdAt: 1 });

        // Chat open karte hi saare messages seen mark kar dein
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId, seen: false },
            { seen: true }
        );

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// 3. Mark Single Message as Seen
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 4. Send Message (Real-time with Socket.io)
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            seen: false
        });

        // Socket.io logic using the imported map and io instance
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ success: true, newMessage });
    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
}