import React, { useState, useEffect, useRef } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("StartUp");
  const [isPublished, setIsPublished] = useState(false);

  // Generate content from AI
  const generateContent = async () => {
    if (!title) return toast.error("Title is required");
    try {
      setLoading(true);

      const { data } = await axios.post("/api/blog/generate-content", {
        prompt: title,
      });

      if (data.content) {
        let cleanContent = data.content;

        cleanContent = cleanContent.replace(/```html|```/g, "").trim();
        cleanContent = cleanContent
          .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<\/?html[^>]*>/gi, "")
          .replace(/<\/?body[^>]*>/gi, "");

        quillRef.current.setContents([]);
        quillRef.current.clipboard.dangerouslyPasteHTML(cleanContent);
      } else {
        toast.error(data.message || "Failed to generate content");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload a thumbnail before adding the blog");
      return;
    }

    try {
      setIsAdding(true);

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("image", image);
      formData.append("blog", JSON.stringify(blog));

      const { data } = await axios.post("/api/blog/add", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setTitle("");
        setSubTitle("");
        quillRef.current.setContents([]);
        setCategory("StartUp");
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your blog here...",
      });

      // Auto-resize editor
      quillRef.current.on("text-change", () => {
        const editor = editorRef.current;
        if (editor) {
          editor.style.height = "auto";
          editor.style.height = editor.scrollHeight + "px";
        }
      });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 min-h-screen p-6 overflow-auto"
    >
      <div className="bg-white w-full max-w-5xl mx-auto p-6 md:p-12 shadow-lg rounded-lg">
        {/* Thumbnail Upload */}
        <p className="font-semibold">Upload thumbnail</p>
        <div className="relative inline-block mt-2">
          <label htmlFor="image" className="block">
            <img
              alt="thumbnail"
              className="h-24 w-24 md:h-32 md:w-32 rounded cursor-pointer object-cover border border-gray-300"
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              name="image"
              id="image"
              hidden
              type="file"
            />
          </label>

          {/*  Remove button */}
          {image && (
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
            >
              ✕
            </button>
          )}
        </div>

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
        <div className="relative mt-2 min-h-[24rem] border border-gray-300 rounded-lg">
          <div ref={editorRef} className="h-auto p-2 overflow-hidden" />

          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          <button
            disabled={loading}
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
          disabled={isAdding}
          type="submit"
          className="mt-8 w-48 h-12 bg-primary text-white rounded-lg cursor-pointer text-lg hover:bg-primary/90 transition"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
