import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import * as util from "../utils.js";

const createComment = util.asyncWrap(async (req, res) => {
  try {
    const payload = { ...req.body };
    payload.author = req.user._id;
    payload.post = res.locals.post._id;
    await Comment.create(payload);
    return res.json({ redirect: true });
  } catch (err) {
    console.log(err);
    return res.json({ errors: util.errorHandler(err) });
  }
});

const updateComment = util.asyncWrap(async (req, res) => {
  try {
    const payload = {
      text: req.body.text,
      author: req.user._id,
      post: res.locals.post._id,
      updatedAt: Date.now(),
    };
    await Comment.updateOne({ _id: req.params.object_id }, payload, {
      runValidators: true,
    });
    return res.json({ redirect: true });
  } catch (err) {
    console.log(err);
    return res.json({ errors: util.errorHandler(err) });
  }
});

const checkPostId = util.asyncWrap(async (req, res, next) => {
  try {
    res.locals.post = await Post.findOne({ _id: req.body.post_id });
    next();
  } catch (err) {
    next(err);
  }
});

export { createComment, checkPostId, updateComment };
