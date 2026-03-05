import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import imageRoutes from "./routes/image.routes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://sprinkled-cpu.github.io"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "CORTEXA backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/images", imageRoutes);

export default app;
