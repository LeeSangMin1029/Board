import Post from "../models/Post";
import Comment from "../models/Comment";
import utils from "../utils";

const renderNewPost = (req, res, next) => {
  try {
    return res.render("posts/new");
  } catch (err) {
    return next(err);
  }
};

const renderEditPost = utils.asyncWrap(async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).lean();
    return res.render("posts/edit", { post: post });
  } catch (err) {
    return next(err);
  }
});

const createPost = utils.asyncWrap(async (req, res, next) => {
  try {
    const post = new Post({
      author: req.user._id,
      title: req.body.title,
      body: req.body.body,
    });
    await post.save();
    return res.json({ response: true });
  } catch (err) {
    return next(err);
  }
});

const renderPosts = utils.asyncWrap(async (req, res, next) => {
  try {
    const { pageInfo } = res;
    const { posts, pageCount } = await queryApplyPostsInfo(pageInfo);
    return res.render("posts/index", {
      posts: posts,
      count: pageCount,
      currentPage: pageInfo.page,
    });
  } catch (err) {
    return next(err);
  }
});

const getPaginatedPosts = utils.asyncWrap(async (req, res, next) => {
  try {
    const { pageInfo } = res;
    const { posts, pageCount } = await queryApplyPostsInfo(pageInfo);
    return res.format({
      "text/html": function () {
        return res.render("posts/index", {
          posts: posts,
          count: pageCount,
          currentPage: pageInfo.page,
        });
      },
      "application/json": function () {
        return res.json({ posts: posts });
      },
    });
  } catch (err) {
    return next(err);
  }
});

const renderPost = utils.asyncWrap(async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .lean()
      .populate({ path: "author", options: { lean: true } });
    const comments = await Comment.find({ post: req.params.id })
      .sort("createdAt")
      .lean()
      .populate({ path: "author", select: "name", options: { lean: true } });
    return res.render("posts/show", {
      post: convertDate(post, "YYYY-MM-DD"),
      comments: getModelArray(comments, "YYYY-MM-DD HH:mm:ss"),
    });
  } catch (err) {
    return next(err);
  }
});

const updatePost = utils.asyncWrap(async (req, res, next) => {
  try {
    const postPayload = {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    };
    await Post.updateOne({ _id: req.params.id }, postPayload, {
      runValidators: true,
    });
    return res.json({ response: true });
  } catch (err) {
    return next(err);
  }
});

const deletePost = utils.asyncWrap(async (req, res, next) => {
  try {
    await Post.findOneAndRemove({ _id: req.params.id });
    await Comment.deleteMany({ post: { $in: req.params.id } });
    return res.json({ response: true });
  } catch (err) {
    return next(err);
  }
});

function getQueryString(req, res, next) {
  const result = {};
  result.page = req.params.page ? req.params.page : 1;
  result.limit = 5;
  result.startIndex = (result.page - 1) * result.limit;
  res.pageInfo = result;
  next();
}

const checkPermission = utils.asyncWrap(async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (post.author.toString() != req.user._id.toString())
      return utils.noPermission(req, res);
    next();
  } catch (err) {
    return next(err);
  }
});

export {
  renderNewPost,
  renderEditPost,
  renderPosts,
  createPost,
  renderPost,
  getPaginatedPosts,
  updatePost,
  deletePost,
  checkPermission,
  getQueryString,
};

async function queryApplyPostsInfo(pageInfo) {
  const postLength = await Post.countDocuments();
  const pageCount = utils.getPageCount(postLength, pageInfo.limit);
  const posts = getModelArray(
    await Post.find()
      .skip(pageInfo.startIndex)
      .limit(pageInfo.limit)
      .sort("-createdAt")
      .lean()
      .populate({
        path: "author",
        options: { lean: true },
      }),
    "YYYY-MM-DD"
  );
  return {
    posts: posts,
    pageCount: pageCount,
  };
}

function getModelArray(models, format) {
  return [...models].map((model) => {
    return convertDate(model, format);
  });
}

function convertDate(model, format) {
  model.createdAt = utils.dateFormatting({
    date: model.createdAt,
    formatString: format,
  });
  if (typeof model.updatedAt !== "undefined") {
    model.updatedAt = utils.dateFormatting({
      date: model.updatedAt,
      formatString: format,
    });
  }
  return model;
}
