import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        // 1. Header se token fetch karna
        const token = req.headers.token;

        // 2. Agar token nahi hai toh Access Denied
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access Denied: No token provided" 
            });
        }

        // 3. Token verify karein
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: Invalid token" 
            });
        }

        // 4. Database se user find karein 
        // FIX: decoded.id use karein kyunki controller mein 'id' sign kiya tha
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // 5. User data ko request mein attach karein
        req.user = user;
        
        // Agle function (Controller) par bhej dein
        next();

    } catch (error) {
        console.error("Error in auth middleware:", error.message);
        
        // JWT specific errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                success: false, 
                message: "Session expired, please login again" 
            });
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};