import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/me", protect, async (req, res) => {
  try {
    const { name, bio, careerGoal, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user,
      { name, bio, careerGoal, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
