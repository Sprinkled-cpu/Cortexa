import Groq from "groq-sdk";
import Skill from "../models/Skill.js";
import AnalysisHistory from "../models/AnalysisHistory.js";

let groq;
function getGroq() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

export async function analyzeSkills(req, res) {
  try {
    const skills = await Skill.find({ user: req.user });

    if (!skills.length) {
      return res.status(400).json({
        message: "No skills found. Add skills before analysis.",
      });
    }

    const skillText = skills
      .map(
        (s) =>
          `${s.name} (Level ${s.level}/10, Target ${s.targetLevel}/10, Category: ${s.category}, Last practiced ${s.lastPracticedDays} days ago)`
      )
      .join("\n");

    const prompt = `You are an expert AI career coach. Analyze the user's skill profile and provide a thorough, visually rich analysis.

User skill data:
${skillText}

Tasks:
1. Assess overall stagnation risk (LOW / MEDIUM / HIGH) with a brief summary explaining why
2. Identify the weakest skills with severity (CRITICAL / MODERATE / MILD) and a short reason
3. Provide 4-6 detailed, specific improvement recommendations with a title, description, and priority (HIGH / MEDIUM / LOW)
4. Generate a 14-day actionable roadmap with daily tasks, focus area, estimated time, and an imageQuery (2-3 word search term for finding a relevant illustration image)

Respond ONLY with valid JSON. No markdown. No explanations.

Format:
{
  "stagnationRisk": "LOW | MEDIUM | HIGH",
  "riskSummary": "1-2 sentence explanation of why this risk level",
  "weakSkills": [{ "name": "skill", "severity": "CRITICAL | MODERATE | MILD", "reason": "why it is weak" }],
  "advice": [{ "title": "Short title", "description": "Detailed actionable advice", "priority": "HIGH | MEDIUM | LOW" }],
  "roadmap": [{ "day": "Day 1", "task": "description", "focus": "skill area", "timeEstimate": "30 min", "imageQuery": "coding laptop", "details": "2-3 sentence detailed explanation of what to do and why", "steps": ["specific substep 1", "specific substep 2", "specific substep 3"] }],
  "overallScore": 65,
  "topStrength": "name of strongest skill"
}`;

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 3072,
      response_format: { type: "json_object" },
    });

    let text = completion.choices[0]?.message?.content || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("RAW GROQ OUTPUT:\n", text);
      return res.status(500).json({
        message: "AI response could not be parsed",
        rawResponse: text,
      });
    }

    await AnalysisHistory.create({
      user: req.user,
      stagnationRisk: ["LOW", "MEDIUM", "HIGH"].includes(parsed.stagnationRisk?.toUpperCase()) ? parsed.stagnationRisk.toUpperCase() : "MEDIUM",
      riskSummary: parsed.riskSummary || "Unable to determine.",
      weakSkills: Array.isArray(parsed.weakSkills) ? parsed.weakSkills : [],
      advice: Array.isArray(parsed.advice) ? parsed.advice : [],
      roadmap: Array.isArray(parsed.roadmap) ? parsed.roadmap : [],
      overallScore: parsed.overallScore || 0,
      topStrength: parsed.topStrength || "Unknown",
      skillSnapshot: skills.map((s) => ({
        name: s.name,
        level: s.level,
        lastPracticedDays: s.lastPracticedDays,
        category: s.category,
      })),
    });

    res.json({
      summary: "AI analysis generated successfully",
      ...parsed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "AI analysis failed",
      error: error.message,
    });
  }
}

export async function getAnalysisHistory(req, res) {
  try {
    const history = await AnalysisHistory.find({ user: req.user })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
