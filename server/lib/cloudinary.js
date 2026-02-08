import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// 1. Environment variables load karein
dotenv.config();

// 2. Cloudinary account link karein
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Zaroori Note: 
 * Is instance ko use karke hum frontend se aane wali base64 
 * images ko cloud par upload karenge.
 */
export default cloudinary;