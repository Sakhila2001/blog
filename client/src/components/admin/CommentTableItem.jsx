import React from "react";
import { assets } from "../../assets/assets";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);

  const handleApprove = async () => {
    // TODO: API call to approve comment
    console.log("Approved:", _id);
    fetchComments(); // refresh list
  };

  const handleDelete = async () => {
    // TODO: API call to delete comment
    console.log("Deleted:", _id);
    fetchComments(); // refresh list
  };

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b>: {blog.title}
        <br />
        <b className="font-medium text-gray-600">Name</b>: {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b>: {comment.content}
      </td>

      <td className="px-6 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>

      <td className="px-6 py-4">
        <div>
          {!comment.isApproved ? (
            <img
              src={assets.tick_icon}
              alt="approve"
              className="w-5 hover:scale-110 transition-all cursor-pointer"
              onClick={handleApprove}
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}

          <img
            src={assets.bin_icon}
            alt="delete"
            className="w-5 mt-2 hover:scale-110 transition-all cursor-pointer"
            onClick={handleDelete}
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
