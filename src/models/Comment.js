import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    text: { type: String, required: [true, "Comment is required!"] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    isDeleted: { type: Boolean },
  },
  {
    toObject: { virtuals: true },
  }
);

commentSchema
  .virtual("childComment")
  .get(function () {
    return this._childComment;
  })
  .set(function (v) {
    this_childComment = v;
  });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
