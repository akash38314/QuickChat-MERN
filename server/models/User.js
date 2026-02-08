import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true, // Email hamesha small letters mein save hoga
        trim: true      // Extra spaces apne aap hat jayengi
    },
    fullName: {
        type: String, 
        required: true,
        trim: true
    },
    password: {
        type: String, 
        required: true, 
        minlength: 6
    },
    profilePic: {
        type: String, 
        default: ""
    },
    bio: {
        type: String, 
        default: "Hey there! I am using QuickChat." // Default bio
    },
}, { timestamps: true });

// Model export
const User = mongoose.model("User", userSchema);

export default User;