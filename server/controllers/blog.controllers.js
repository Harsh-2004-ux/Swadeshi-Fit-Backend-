import { asyncHandler } from "../utils/Asynchandler.js";
import { Blog } from "../models/blog.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }
  const blog = await Blog.create({
    title,
    content,
    author: req.user.name, // using logged in user's name
    tags: tags || [],
  });
  res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

// Get All Blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

// Get Single Blog
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");
  res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found");
  res.status(200).json(new ApiResponse(200, {}, "Blog deleted successfully"));
});

export { createBlog, getAllBlogs, getBlogById, deleteBlog };
