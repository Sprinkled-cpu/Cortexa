import express from "express";
import { analyzeSkills, getAnalysisHistory } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/analyze", protect, analyzeSkills);
router.get("/history", protect, getAnalysisHistory);

export default router;

