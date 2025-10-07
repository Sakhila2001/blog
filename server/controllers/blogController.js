import imagekit, { toFile } from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

// Add a new blog
export const addBlog = async (req, res) => {
  try {
    if (!req.body.blog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog data is missing" });
    }

    let blogData;
    try {
      blogData = JSON.parse(req.body.blog);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Blog data is not valid JSON" });
    }

    const { title, subTitle, description, category, isPublished } = blogData;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is missing" });
    }

    console.log("File received:", imageFile.originalname);

    const uploaded = await imagekit.files.upload({
      file: await toFile(imageFile.buffer, imageFile.originalname),
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImageUrl = imagekit.helper.buildSrc({
      urlEndpoint: "https://ik.imagekit.io/greatstackSakhila",
      src: uploaded.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: 1280 },
      ],
    });

    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
    });

    res.status(201).json({
      success: true,
      message: "Blog added successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error in addBlog:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Dashboard data
// export const getDashboardData = async (req, res) => {
//   try {
//     const blogs = await Blog.find();
//     const comments = await Comment.find();
//     const drafts = await Blog.find({ isPublished: false });

//     res.json({
//       success: true,
//       dashboard: {
//         blogs: blogs.length,
//         comments: comments.length,
//         drafts: drafts.length,
//         recentBlogs: blogs.slice(0, 10),
//       },
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

export const getDashboardData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort newest first
    const comments = await Comment.find();
    const drafts = await Blog.find({ isPublished: false });

    res.json({
      success: true,
      dashboard: {
        blogs: blogs.length,
        comments: comments.length,
        drafts: drafts.length,
        recentBlogs: blogs.slice(skip, skip + limit), // Paginate blogs
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete blog
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    await Blog.findByIdAndDelete(id);
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle publish
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({
      success: true,
      message: "Blog status updated",
      isPublished: blog.isPublished,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { blogId, name, content } = req.body;
    await Comment.create({ blog: blogId, name, content });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get comments
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ AI generate content (return HTML instead of Markdown)
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    const raw = await main(
      `${prompt}. Write a detailed blog post about this topic in HTML format with <h2>, <p>, <ul>, <li>, and <strong>.`
    );

    res.json({ success: true, content: raw });
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate content" });
  }
};
export const editBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    let blogData;
    try {
      blogData = JSON.parse(req.body.blog);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid JSON" });
    }

    const { title, subTitle, description, category, isPublished } = blogData;

    if (req.file) {
      const uploaded = await imagekit.files.upload({
        file: await toFile(req.file.buffer, req.file.originalname),
        fileName: req.file.originalname,
        folder: "/blogs",
      });

      const optimizedImageUrl = imagekit.helper.buildSrc({
        urlEndpoint: "https://ik.imagekit.io/greatstackSakhila",
        src: uploaded.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: 1280 },
        ],
      });

      existingBlog.image = optimizedImageUrl;
    }

    existingBlog.title = title;
    existingBlog.subTitle = subTitle;
    existingBlog.description = description;
    existingBlog.category = category;
    existingBlog.isPublished = isPublished;

    await existingBlog.save();

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog: existingBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
