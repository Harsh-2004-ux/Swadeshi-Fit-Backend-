import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    type: {
      type: String,
      required: true, // e.g. "Running", "Football", "Yoga"
      trim: true,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
