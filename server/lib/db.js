import mongoose from "mongoose";

/**
 * MongoDB Atlas se connection establish karne ke liye function
 */
export const connectDB = async () => {
    try {
        // Environment variable se connection string fetch karna
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed!");
        console.error(`Reason: ${error.message}`); // Detailed error log
        
        // Agar DB connect na ho toh server exit karein
        process.exit(1); 
    }
};