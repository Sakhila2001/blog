import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    blog: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Blog",   // must match the Blog model name
        required: true
    },
    name: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    isApproved: { 
        type: Boolean, 
        required: true, 
        default: false   // optional: default to false
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
