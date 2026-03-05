import Skill from "../models/Skill.js";

// Add a new skill
export async function addSkill(req, res) {
  try {
    const { name, level, lastPracticedDays, category, targetLevel, notes } = req.body;

    if (!name || level == null || lastPracticedDays == null) {
      return res.status(400).json({ message: "All fields required" });
    }

    const skill = await Skill.create({
      user: req.user,
      name,
      level,
      lastPracticedDays,
      category,
      targetLevel,
      notes,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all skills for logged-in user
export async function getSkills(req, res) {
  try {
    const skills = await Skill.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a skill
export async function updateSkill(req, res) {
  try {
    const { id } = req.params;

    const skill = await Skill.findOneAndUpdate(
      { _id: id, user: req.user },
      req.body,
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete a skill
export async function deleteSkill(req, res) {
  try {
    const { id } = req.params;

    const skill = await Skill.findOneAndDelete({
      _id: id,
      user: req.user,
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({ message: "Skill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
