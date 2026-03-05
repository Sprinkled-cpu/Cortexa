import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import imageRoutes from "./routes/image.routes.js";

const app = express();

app.use(cors());
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

// Serve frontend static files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../Client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Client/dist/index.html"));
});

export default app;
