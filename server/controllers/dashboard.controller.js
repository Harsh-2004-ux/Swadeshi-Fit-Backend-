import { Activity } from "../models/activity.models.js";
import { Tracker } from "../models/tracker.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password -refreshToken");

  // BMI calculation if weight & height available (height in cm)
  let bmi = null;
  let bmiStatus = null;
  if (user && user.weight && user.height) {
    const heightM = user.height / 100;
    bmi = +(user.weight / (heightM * heightM)).toFixed(1);
    if (bmi < 18.5) bmiStatus = "Underweight";
    else if (bmi < 25) bmiStatus = "Normal";
    else if (bmi < 30) bmiStatus = "Overweight";
    else bmiStatus = "Obese";
  }

  // recent 7 activities
  const recentActivities = await Activity.find({ userId })
    .sort({ date: -1 })
    .limit(7);

  // today's tracker
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const tracker = await Tracker.findOne({ userId, date: startOfDay });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: user,
        bmi,
        bmiStatus,
        recentActivities,
        todayTracker: tracker || null,
      },
      "Dashboard data"
    )
  );
});
