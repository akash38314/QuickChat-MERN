import express from "express";
import { signup, login, updateProfile, checkAuth, getUsersForSidebar } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth); // Is line ke liye checkAuth export hona zaroori hai
router.get("/users", protectRoute, getUsersForSidebar);

export default router;