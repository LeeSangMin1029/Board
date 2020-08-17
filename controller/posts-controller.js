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

const renderPosts = util.asyncWrap(async (req, res) => {
  try {
    const { pageInfo } = res;
    const { posts, pageCount } = await queryApplyPostsInfo(pageInfo);
    return res.render("posts/index", {
      posts: posts,
      count: pageCount,
      currentPage: pageInfo.page,
    });
  } catch (err) {
    console.log(err);
  }
});

const getPaginatedPosts = util.asyncWrap(async (req, res) => {
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
    return res.send(err);
  }
});

const renderPost = util.asyncWrap(async (req, res) => {
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

function getQueryString(req, res, next) {
  const result = {};
  result.page = req.params.page;
  result.limit = 5;
  result.startIndex = (result.page - 1) * result.limit;
  res.pageInfo = result;
  next();
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
  const pageCount = util.getPageCount(postLength, pageInfo.limit);
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
  model.createdAt = util.dateFormatting({
    date: model.createdAt,
    formatString: format,
  });
  if (typeof model.updatedAt !== "undefined") {
    model.updatedAt = util.dateFormatting({
      date: model.updatedAt,
      formatString: format,
    });
  }
  return model;
}

function partialSearchedPosts(searchText) {
  console.log(searchText);
}
