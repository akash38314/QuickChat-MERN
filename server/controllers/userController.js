import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. Signup Logic
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword, bio: bio || "" });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            success: true,
            token,
            userData: { _id: newUser._id, fullName, email, bio: newUser.bio },
            message: "Account created successfully!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Login Logic
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            token,
            userData: { _id: user._id, fullName: user.fullName, email: user.email, bio: user.bio || "" },
            message: "Welcome back!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 3. Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const userId = req.user._id; 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, bio, profilePic },
            { new: true }
        );

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 4. CheckAuth Logic
export const checkAuth = (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};