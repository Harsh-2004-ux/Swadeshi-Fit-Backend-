import { Tracker } from "../models/tracker.models.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Upsert today's tracker (create or update)
export const upsertTracker = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    date,
    steps = 0,
    waterLiters = 0,
    sleepHours = 0,
    caloriesConsumed = 0,
  } = req.body;

  const day = date ? new Date(date) : new Date();
  // normalize to midnight for uniqueness by day (optional)
  const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());

  const updated = await Tracker.findOneAndUpdate(
    { userId, date: startOfDay },
    {
      $set: {
        steps,
        waterLiters,
        sleepHours,
        caloriesConsumed,
        date: startOfDay,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json(new ApiResponse(200, updated, "Tracker saved"));
});

// Get tracker for specific day (default: today)
export const getTracker = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { date } = req.query;
  const day = date ? new Date(date) : new Date();
  const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());

  const tracker = await Tracker.findOne({ userId, date: startOfDay });
  return res.status(200).json(
    new ApiResponse(
      200,
      tracker || {
        userId,
        date: startOfDay,
        steps: 0,
        waterLiters: 0,
        sleepHours: 0,
        caloriesConsumed: 0,
      },
      "Tracker fetched"
    )
  );
});
