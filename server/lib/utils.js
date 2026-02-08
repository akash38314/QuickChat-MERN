import jwt from "jsonwebtoken";

/**
 * Function to generate a JWT token for a user
 * @param {string} userId - User ka unique ID database se
 * @returns {string} - Signed JWT token
 */
export const generateToken = (userId) => {
    // Error handling agar JWT_SECRET missing ho
    if (!process.env.JWT_SECRET) {
        console.error("❌ JWT_SECRET is not defined in environment variables!");
    }

    // Token generation logic with 7 days expiry
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", 
    });

    return token;
};