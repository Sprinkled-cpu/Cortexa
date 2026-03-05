import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  imageQuery: { type: String },
  details: { type: String },
  steps: [{ type: String }],
  resources: [{
    title: { type: String },
    url: { type: String },
    type: { type: String },
  }],
  completed: { type: Boolean, default: false },
});

const weekSchema = new mongoose.Schema({
  week: { type: String, required: true },
  title: { type: String, required: true },
  items: [taskSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    duration: { type: String, default: "4 Weeks" },
    objective: { type: String },
    difficulty: { type: String, default: "Adaptive" },
    weeks: [weekSchema],
    completionPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

roadmapSchema.methods.recalculateCompletion = function () {
  let total = 0;
  let done = 0;

  this.weeks.forEach((w) => {
    w.items.forEach((item) => {
      total++;
      if (item.completed) done++;
    });
  });

  this.completionPercentage = total === 0 ? 0 : Math.round((done / total) * 100);
};

export default mongoose.model("Roadmap", roadmapSchema);
