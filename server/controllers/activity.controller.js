import { Activity } from "../models/activity.models.js";
import { Tracker } from "../models/tracker.models.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

// Add new activity
export const addActivity = asyncHandler(async (req, res) => {
  const {
    type,
    durationMinutes = 0,
    caloriesBurned = 0,
    date,
    notes = "",
  } = req.body;
  const userId = req.user._id;

  const activity = await Activity.create({
    userId,
    type,
    durationMinutes,
    caloriesBurned,
    date: date ? new Date(date) : new Date(),
    notes,
  });

  return res.status(201).json(new ApiResponse(201, activity, "Activity added"));
});

// Get user's activities (paginated optional)
export const getActivities = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { from, to, page = 1, limit = 20 } = req.query;

  const filter = { userId };

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const activities = await Activity.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res
    .status(200)
    .json(new ApiResponse(200, activities, "Activities fetched"));
});

// Update activity
export const updateActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid activity id");

  const activity = await Activity.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    req.body,
    { new: true }
  );

  if (!activity) throw new ApiError(404, "Activity not found");
  return res
    .status(200)
    .json(new ApiResponse(200, activity, "Activity updated"));
});

// Delete activity
export const deleteActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid activity id");

  const deleted = await Activity.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });
  if (!deleted) throw new ApiError(404, "Activity not found");

  return res.status(200).json(new ApiResponse(200, {}, "Activity deleted"));
});
