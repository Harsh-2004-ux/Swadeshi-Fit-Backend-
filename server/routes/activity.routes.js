import { Router } from "express";
import {
  addActivity,
  getActivities,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller.js";
import {
  upsertTracker,
  getTracker,
} from "../controllers/tracker.controller.js";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Activities
router.post("/activities", verifyJWT, addActivity);
router.get("/activities", verifyJWT, getActivities);
router.put("/activities/:id", verifyJWT, updateActivity);
router.delete("/activities/:id", verifyJWT, deleteActivity);

// Tracker
router.put("/tracker", verifyJWT, upsertTracker); // upsert
router.get("/tracker", verifyJWT, getTracker);

// Dashboard
router.get("/dashboard", verifyJWT, getDashboard);

export default router;
