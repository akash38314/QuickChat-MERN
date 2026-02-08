import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

// 1. Signup Logic
export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) return res.status(400).json({ message: "All fields are required" });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ success: true, token, userData: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Login Logic (FIX: Isse 'login' export error chala jayega)
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({ success: true, token, userData: user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 3. Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 4. CheckAuth (FIX: Isse pichla error solve hoga)
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 5. Get Users For Sidebar (FIX: Isse "No users found" solve hoga)
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};