import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    text: { 
        type: String, 
        trim: true, // Extra spaces remove karne ke liye
        default: "" 
    },
    image: { 
        type: String, 
        default: ""
    },
    seen: {
        type: Boolean, 
        default: false // Default unseen
    }
}, { timestamps: true });

// Message Model export
const Message = mongoose.model("Message", messageSchema);

export default Message;