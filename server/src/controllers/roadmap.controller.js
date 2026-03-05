import Groq from "groq-sdk";
import Skill from "../models/Skill.js";
import Roadmap from "../models/Roadmap.js";

let groq;
function getGroq() {
    if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    return groq;
}

export async function generateRoadmap(req, res) {
    try {
        const skills = await Skill.find({ user: req.user });

        if (!skills.length) {
            return res.status(400).json({ message: "Add skills before generating a roadmap." });
        }

        const skillText = skills
            .map(
                (s) =>
                    `${s.name} (Level ${s.level}/10, Target ${s.targetLevel}/10, Category: ${s.category}, Last practiced ${s.lastPracticedDays} days ago)`
            )
            .join("\n");

        const prompt = `You are a career development coach creating a personalized learning roadmap.

User skills:
${skillText}

Create a structured 4-week learning roadmap. Each week should have a theme and 3-4 specific actionable tasks. For each task include:
- imageQuery: a 2-3 word search term for finding a relevant stock photo
- details: a 2-3 sentence detailed explanation of what to do and why this matters
- steps: 3-4 specific actionable substeps to complete this task
- resources: 1-2 recommended internet resources (free tutorials, documentation, courses, YouTube videos, articles) with real, actual URLs that exist on the internet

Respond ONLY with valid JSON in this exact format:
{
  "title": "string - a short descriptive title for this roadmap",
  "objective": "string - one sentence describing the primary goal",
  "weeks": [
    {
      "week": "Week 1",
      "title": "string - theme name",
      "items": [
        {
          "task": "string - specific actionable task",
          "imageQuery": "coding laptop",
          "details": "2-3 sentence detailed explanation",
          "steps": ["substep 1", "substep 2", "substep 3"],
          "resources": [
            { "title": "Resource Name", "url": "https://example.com", "type": "article" }
          ]
        }
      ]
    }
  ]
}`;

        const completion = await getGroq().chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 4096,
            response_format: { type: "json_object" },
        });

        let text = completion.choices[0]?.message?.content || "";
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch {
            return res.status(500).json({
                message: "Failed to parse AI response",
                rawResponse: text,
            });
        }

        const roadmap = await Roadmap.create({
            user: req.user,
            title: parsed.title || "AI Generated Roadmap",
            objective: parsed.objective || "",
            weeks: parsed.weeks.map((w) => ({
                week: w.week,
                title: w.title,
                items: w.items.map((i) => ({
                    task: typeof i === "string" ? i : i.task,
                    imageQuery: typeof i === "object" ? i.imageQuery : null,
                    details: typeof i === "object" ? i.details : null,
                    steps: typeof i === "object" && Array.isArray(i.steps) ? i.steps : [],
                    resources: typeof i === "object" && Array.isArray(i.resources) ? i.resources : [],
                    completed: false,
                })),
            })),
        });

        res.status(201).json(roadmap);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Roadmap generation failed", error: error.message });
    }
}

export async function getRoadmaps(req, res) {
    try {
        const roadmaps = await Roadmap.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(roadmaps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getRoadmapById(req, res) {
    try {
        const roadmap = await Roadmap.findOne({ _id: req.params.id, user: req.user });

        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap not found" });
        }

        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function toggleTask(req, res) {
    try {
        const { id } = req.params;
        const { weekIndex, taskIndex } = req.body;

        const roadmap = await Roadmap.findOne({ _id: id, user: req.user });

        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap not found" });
        }

        const week = roadmap.weeks[weekIndex];
        if (!week || !week.items[taskIndex]) {
            return res.status(400).json({ message: "Invalid task reference" });
        }

        week.items[taskIndex].completed = !week.items[taskIndex].completed;
        roadmap.recalculateCompletion();
        await roadmap.save();

        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteRoadmap(req, res) {
    try {
        const roadmap = await Roadmap.findOneAndDelete({
            _id: req.params.id,
            user: req.user,
        });

        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap not found" });
        }

        res.json({ message: "Roadmap deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
