import express from "express";
import { 
  addBlog, 
  addComment, 
  deleteBlogById, 
  getAllBlogs, 
  getBlogById, 
  getBlogComments, 
  togglePublish, 
  getDashboardData, 
  generateContent,
  editBlog
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

// Middleware: multer -> auth -> controller
blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);

// Edit blog route
blogRouter.post("/edit/:blogId", upload.single("image"), auth, editBlog);

blogRouter.post("/add-comment", addComment);
blogRouter.post("/comments", getBlogComments);

// dashboard route BEFORE :blogId
blogRouter.get("/dashboard", getDashboardData);

// Keep this LAST
blogRouter.get("/:blogId", getBlogById);

blogRouter.post("/generate-content", auth, generateContent);

export default blogRouter;
