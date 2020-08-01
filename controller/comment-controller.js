import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import * as util from "../utils.js";

const createComment = util.asyncWrap(async (req, res) => {
  try {
    const post = res.locals.post;
    const payload = { ...req.body };
    payload.author = req.user._id;
    payload.post = post._id;
    await Comment.create(payload);
    return res.json({ redirect: true });
  } catch (err) {
    console.log(err);
    return res.json({ error: util.errorHandler(err) });
  }
});

export { createComment, checkPostId };

const checkPostId = util.asyncWrap(async (req, res, next) => {
  try {
    res.locals.post = await Post.findOne({ _id: req.body.post_id });
    next();
  } catch (err) {
    next(err);
  }
});
