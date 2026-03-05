import mongoose from "mongoose";

const analysisHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        stagnationRisk: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
        riskSummary: String,
        weakSkills: [mongoose.Schema.Types.Mixed],
        advice: [mongoose.Schema.Types.Mixed],
        roadmap: [mongoose.Schema.Types.Mixed],
        overallScore: Number,
        topStrength: String,
        skillSnapshot: [
            {
                name: String,
                level: Number,
                lastPracticedDays: Number,
                category: String,
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("AnalysisHistory", analysisHistorySchema);
