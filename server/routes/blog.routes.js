import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
} from "../controllers/blog.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Only logged-in users can create blogs
router.post("/create", verifyJWT, createBlog);
router.get("/all", getAllBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", verifyJWT, deleteBlog);

export default router;
