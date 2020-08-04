import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import * as util from "../utils.js";

const renderNewPost = (req, res) => {
  try {
    return res.render("posts/new");
  } catch (err) {
    return res.send(err);
  }
};

const renderEditPost = util.asyncWrap(async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).lean();
    return res.render("posts/edit", { post: post });
  } catch (err) {
    return res.send(err);
  }
});

const createPost = util.asyncWrap(async (req, res) => {
  try {
    const post = new Post({
      author: req.user._id,
      title: req.body.postTitle,
      body: req.body.postBody,
    });
    await post.save();
    return res.json({ redirect: true });
  } catch (err) {
    return res.json({ errors: util.errorHandler(err) });
  }
});

const getPaginatedPosts = util.asyncWrap(async (req, res) => {
  try {
    const page = req.params.page;
    const limit = 5;
    const startIndex = (page - 1) * limit;
    const posts = getPostArray(
      await Post.find()
        .skip(startIndex)
        .limit(limit)
        .sort("-createdAt")
        .lean()
        .populate({
          path: "author",
          options: { lean: true },
        })
    );
    const postLength = await Post.countDocuments();
    const pageCount = util.getPageCount(postLength, limit);
    return res.format({
      "text/html": function () {
        return res.render("posts/index", {
          posts: posts,
          count: pageCount,
          page: page,
        });
      },
      "application/json": function () {
        return res.json({ posts: posts });
      },
    });
  } catch (err) {
    return res.send(err);
  }
});

const rePaginatedPosts = (req, res) => {
  return res.redirect("/posts/page/1");
};

const renderPost = util.asyncWrap(async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .lean()
      .populate({ path: "author", options: { lean: true } });
    const comments = await Comment.find({ post: req.params.id })
      .sort("createdAt")
      .lean()
      .populate({ path: "author", select: "name", options: { lean: true } });
    const result = getPostWithComments(comments, post);
    return res.render("posts/show", {
      post: result.post,
      comments: result.comments,
    });
  } catch (err) {
    return res.send(err);
  }
});

const updatePost = util.asyncWrap(async (req, res) => {
  try {
    const postPayload = {
      title: req.body.postTitle,
      body: req.body.postBody,
      updatedAt: Date.now(),
    };
    await Post.updateOne({ _id: req.params.id }, postPayload, {
      runValidators: true,
    });
    return res.json({ redirect: true });
  } catch (err) {
    return res.json({ errors: util.errorHandler(err) });
  }
});

const deletePost = util.asyncWrap(async (req, res) => {
  try {
    await Post.findOneAndRemove({ _id: req.params.id });
    await Comment.deleteMany({ post: { $in: req.params.id } });
    return res.json({ redirect: true });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

export {
  renderNewPost,
  renderEditPost,
  createPost,
  renderPost,
  getPaginatedPosts,
  updatePost,
  deletePost,
  rePaginatedPosts,
  checkPermission,
};

function getPostArray(posts) {
  return [...posts].map((post) => {
    return getPost(post, "YYYY-MM-DD");
  });
}

function getCommentArray(comments, format) {
  return [...comments].map((comment) => {
    comment.createdAt = util.dateFormatting({
      date: comment.createdAt,
      formatString: format,
    });
    if (typeof comment.updatedAt !== "undefined") {
      comment.updatedAt = util.dateFormatting({
        date: comment.updatedAt,
        formatString: format,
      });
    }
    return comment;
  });
}

function getPostWithComments(comments, post) {
  const format = "YYYY-MM-DD HH:mm:ss";
  const result = {};
  result.post = getPost(post, format);
  result.comments = getCommentArray(comments, format);
  return result;
}

function getPost(post, format) {
  post.createdAt = util.dateFormatting({
    date: post.createdAt,
    formatString: format,
  });
  if (typeof post.updatedAt !== "undefined") {
    post.updatedAt = util.dateFormatting({
      date: post.updatedAt,
      formatString: format,
    });
  }
  return post;
}

const checkPermission = util.asyncWrap(async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (post.author.toString() != req.user._id.toString())
      return util.noPermission(req, res);
    next();
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
