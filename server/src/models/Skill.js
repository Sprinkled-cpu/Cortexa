import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    lastPracticedDays: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "DevOps",
        "Data Science",
        "Mobile",
        "Design",
        "DSA",
        "Other",
      ],
      default: "Other",
    },
    targetLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 10,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
