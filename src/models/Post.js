import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required!"] },
  body: { type: String, required: [true, "Body is required!"] },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Post = mongoose.model("Post", postSchema);
export default Post;
