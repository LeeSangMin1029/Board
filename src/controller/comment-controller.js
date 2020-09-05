import Comment from "../models/Comment";
import Post from "../models/Post";
import utils from "../utils";

const createComment = utils.asyncWrap(async (req, res, next) => {
  try {
    const payload = { ...req.body };
    payload.author = req.user._id;
    payload.post = res.locals.post._id;
    await Comment.create(payload);
    return res.json({ response: { success: true } });
  } catch (err) {
    return next(err);
  }
});

const updateComment = utils.asyncWrap(async (req, res, next) => {
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
    return res.json({ response: { success: true } });
  } catch (err) {
    return next(err);
  }
});

const destoryComment = utils.asyncWrap(async (req, res, next) => {
  try {
    await Comment.deleteOne({ _id: req.params.object_id });
    return res.json({ response: { success: true } });
  } catch (err) {
    return next(err);
  }
});

const checkPostId = utils.asyncWrap(async (req, res, next) => {
  try {
    res.locals.post = await Post.findOne({ _id: req.body.post_id });
    return next();
  } catch (err) {
    return next(err);
  }
});

export { createComment, checkPostId, updateComment, destoryComment };
