import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
    },
    skillName: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 10 },
    capturedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Progress", progressSchema);
