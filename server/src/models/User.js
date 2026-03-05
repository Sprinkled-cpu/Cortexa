import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    careerGoal: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
