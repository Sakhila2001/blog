import React, { useState, useEffect, useRef } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("StartUp");
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    // TODO: Implement AI content generation
    console.log("Generate AI content");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const blogData = {
      title,
      subTitle,
      category,
      isPublished,
      content: quillRef.current.root.innerHTML,
      image,
    };
    console.log("Submitting blog:", blogData);
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        {/* Thumbnail Upload */}
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            alt="thumbnail"
            className="mt-2 h-16 rounded cursor-pointer object-cover"
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            name="image"
            id="image"
            hidden
            required
            type="file"
          />
        </label>

        {/* Blog Title */}
        <p className="mt-4">Blog title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          type="text"
        />

        {/* Sub Title */}
        <p className="mt-4">Sub title</p>
        <input
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          type="text"
        />

        {/* Blog Description */}
        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-72 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef} className="h-full" />
          <button
            onClick={generateContent}
            type="button"
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
          >
            Generate with AI
          </button>
        </div>

        {/* Blog Category */}
        <p className="mt-4">Blog category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Publish Checkbox */}
        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            className="scale-125 cursor-pointer"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          Add Blog
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
