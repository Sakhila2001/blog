import imagekit, { toFile } from "../configs/imageKit.js";
import Blog from "../models/Blog.js"; //  matches filename
import Comment from "../models/Comment.js"; //  matches filename

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

    console.log(
      " File received:",
      imageFile.originalname,
      imageFile.mimetype,
      imageFile.size
    );

    const uploaded = await imagekit.files.upload({
      file: await toFile(imageFile.buffer, imageFile.originalname),
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    console.log(" Uploaded to ImageKit:", uploaded.url);

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
    console.error(" Error in addBlog:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all published blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
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

// Delete blog by ID
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
    // Delete all comments associated with the blog
    await Comment.deleteMany({blog: id});

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle blog publish status
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

// Add comment to a blog
export const addComment = async (req, res) => {
  try {
    const { blogId, name, content } = req.body;

    await Comment.create({ blog, name, content });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({success: true, comments})
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
