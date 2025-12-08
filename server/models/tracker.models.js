import mongoose from "mongoose";

const trackerSchema = new mongoose.Schema(
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
    steps: { type: Number, default: 0 },
    waterLiters: { type: Number, default: 0 }, // liters
    sleepHours: { type: Number, default: 0 },
    caloriesConsumed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ensure one doc per user per day (optional but handy)
trackerSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Tracker = mongoose.model("Tracker", trackerSchema);
