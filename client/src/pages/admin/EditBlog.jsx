import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { assets, blogCategories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EditBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [content, setContent] = useState(""); // ✅ State for Quill content
  const [quill, setQuill] = useState(null); // Keep Quill instance in state

  // Initialize Quill editor once
  useEffect(() => {
    const editor = new Quill("#editor", {
      theme: "snow",
      placeholder: "Write your blog here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["link", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
    });

    editor.on("text-change", () => {
      setContent(editor.root.innerHTML); // update state on content change
    });

    setQuill(editor);
  }, []);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/blog/${blogId}`);
        if (data.success) {
          const b = data.blog;
          setBlogData(b);
          setTitle(b.title);
          setSubTitle(b.subTitle);
          setCategory(b.category);
          setIsPublished(b.isPublished);
          setImage(b.image);
          setContent(b.description || "");

          // Set Quill content if editor is initialized
          if (quill) quill.root.innerHTML = b.description || "";
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId, axios, quill]);

  // Generate AI content
  const generateContent = async () => {
    if (!title) return toast.error("Title is required");
    if (!quill) return toast.error("Editor not initialized");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate-content", {
        prompt: title,
      });
      if (data.content) {
        const cleanContent = data.content
          .replace(/```html|```/g, "")
          .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<\/?html[^>]*>/gi, "")
          .replace(/<\/?body[^>]*>/gi, "");

        quill.root.innerHTML = cleanContent;
        setContent(cleanContent); // update state
      } else {
        toast.error(data.message || "Failed to generate content");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit form
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);

      const blog = {
        title,
        subTitle,
        description: content,
        category,
        isPublished,
      };

      const formData = new FormData();
      if (image instanceof File) formData.append("image", image);
      formData.append("blog", JSON.stringify(blog));

      const { data } = await axios.post(`/api/blog/edit/${blogId}`, formData);

      if (data.success) {
        toast.success(data.message || "Blog updated successfully");
        navigate("/admin/list-blog");
      } else {
        toast.error(data.message || "Failed to update blog");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !blogData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 min-h-screen p-6 overflow-auto"
    >
      <div className="bg-white w-full max-w-5xl mx-auto p-6 md:p-12 shadow-lg rounded-lg">
        {/* Thumbnail Upload */}
        <p className="font-semibold">Upload thumbnail</p>
        <label htmlFor="image" className="block mt-2">
          <img
            alt="thumbnail"
            className="h-24 w-24 md:h-32 md:w-32 rounded cursor-pointer object-cover border border-gray-300"
            src={
              image instanceof File
                ? URL.createObjectURL(image)
                : image
                ? image
                : assets.upload_area
            }
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            name="image"
            id="image"
            hidden
            type="file"
          />
        </label>

        {/* Blog Title */}
        <p className="mt-6 font-semibold">Blog title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Type here"
          required
          className="w-full mt-2 p-3 border border-gray-300 outline-none rounded-lg text-lg"
          type="text"
        />

        {/* Sub Title */}
        <p className="mt-6 font-semibold">Sub title</p>
        <input
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
          placeholder="Type here"
          required
          className="w-full mt-2 p-3 border border-gray-300 outline-none rounded-lg text-lg"
          type="text"
        />

        {/* Blog Description */}
        <p className="mt-6 font-semibold">Blog Description</p>
        <div className="relative mt-2 border border-gray-300 rounded-lg">
          <div id="editor" className="min-h-[300px] p-2 ql-container ql-snow" />
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <button
            disabled={loading || !quill}
            onClick={generateContent}
            type="button"
            className="absolute bottom-2 right-2 text-sm text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
          >
            {loading ? "Generating..." : "✨ Generate with AI"}
          </button>
        </div>

        {/* Blog Category */}
        <p className="mt-6 font-semibold">Blog category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className="mt-2 w-full px-4 py-3 border text-gray-700 border-gray-300 outline-none rounded-lg text-lg"
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Publish Checkbox */}
        <div className="flex items-center gap-2 mt-6">
          <input
            className="scale-125 cursor-pointer"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <p className="font-semibold">Publish Now</p>
        </div>

        {/* Submit Button */}
        <button
          disabled={updating}
          type="submit"
          className="mt-8 w-48 h-12 bg-primary text-white rounded-lg cursor-pointer text-lg hover:bg-primary/90 transition"
        >
          {updating ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </form>
  );
};

export default EditBlog;
