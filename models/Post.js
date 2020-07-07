const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  body: { type: String, required: [true, "Body is required"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = mongoose.model("Post", postSchema);
