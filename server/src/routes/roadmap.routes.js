import express from "express";
import {
    generateRoadmap,
    getRoadmaps,
    getRoadmapById,
    toggleTask,
    deleteRoadmap,
} from "../controllers/roadmap.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/generate", generateRoadmap);
router.get("/", getRoadmaps);
router.get("/:id", getRoadmapById);
router.patch("/:id/toggle-task", toggleTask);
router.delete("/:id", deleteRoadmap);

export default router;
