import express from "express";
import {
    captureProgress,
    getProgressHistory,
    getDashboardStats,
} from "../controllers/progress.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/capture", captureProgress);
router.get("/history", getProgressHistory);
router.get("/dashboard", getDashboardStats);

export default router;
