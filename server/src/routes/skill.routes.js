import express from "express";
import {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// /api/skills
router.post("/", addSkill);
router.get("/", getSkills);

// /api/skills/:id
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
