import { Router } from "express";
import {
  RegisterUser,
  loginUser,
  logoutUser,
  updateProfile,
  getUserProfile
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/profile").get(verifyJWT, getUserProfile);
router.route("/signup").post(RegisterUser);
router.route("/login").post(loginUser);
// secure route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-profile").post(verifyJWT, updateProfile);
export default router;
