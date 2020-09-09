import mongoose from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";
import utils from "../utils";

const ObjectId = mongoose.Types.ObjectId;

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
    return res.json({ response: { success: true } });
  } catch (err) {
    return next(err);
  }
});

const renderPosts = utils.asyncWrap(async (req, res, next) => {
  try {
    const { searchQuery } = createSearchQuery(req);
    const { posts, pageCount, currentPage } = await queryApplyPosts(
      res,
      searchQuery
    );
    const renderElements = {
      posts: posts,
      count: pageCount,
      currentPage: currentPage,
    };
    return res.format({
      "application/json": function () {
        return res.json(renderElements);
      },
      "text/html": function () {
        return res.render("posts/index", renderElements);
      },
    });
  } catch (err) {
    return next(err);
  }
});

const renderPost = utils.asyncWrap(async (req, res, next) => {
  try {
    const post = await Post.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ]);
    const comments = await Comment.aggregate([
      { $match: { post: ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      { $sort: { createdAt: 1 } },
      { $project: { name: 0 } },
    ]);
    return res.render("posts/show", {
      post: convertDate(post[0], "YYYY-MM-DD"),
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
    return res.json({ response: { success: true } });
  } catch (err) {
    return next(err);
  }
});

const deletePost = utils.asyncWrap(async (req, res, next) => {
  try {
    await Post.findOneAndRemove({ _id: req.params.id });
    await Comment.deleteMany({ post: { $in: req.params.id } });
    return res.redirect({ response: { success: true } });
  } catch (err) {
    return next(err);
  }
});

function getQueryString(req, res, next) {
  const result = {};
  result.page = req.query.page ? req.query.page : 1;
  result.limit = 5;
  result.startIndex = (result.page - 1) * result.limit;
  res.subject = {};
  res.subject.pageInfo = result;
  next();
}

function createSearchQuery({ query }) {
  const result = {};
  if (
    typeof query !== "undefined" ||
    (Object.keys(query.search).length !== 0 &&
      query.search.constructor === Object)
  ) {
    const regexQuery = { $regex: new RegExp(query.search, "i") };
    result.searchQuery = {
      $or: [{ title: regexQuery }],
    };
  }
  return result;
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
  renderPost,
  createPost,
  updatePost,
  deletePost,
  checkPermission,
  getQueryString,
};

async function queryApplyPosts({ subject }, searchQuery = {}) {
  try {
    const { pageInfo } = subject;
    const aggregateQuery = [];
    let postLength = await Post.countDocuments();
    if (
      Object.keys(searchQuery).length !== 0 &&
      searchQuery.constructor === Object
    ) {
      postLength = await Post.countDocuments(searchQuery);
      aggregateQuery.push({ $match: searchQuery });
    }
    aggregateQuery.push(
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      { $project: { name: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: pageInfo.startIndex },
      { $limit: pageInfo.limit }
    );
    const pageCount = utils.getPageCount(postLength, pageInfo.limit);
    const posts = getModelArray(
      await Post.aggregate(aggregateQuery),
      "YYYY-MM-DD"
    );
    return {
      posts: posts,
      pageCount: pageCount,
      currentPage: pageInfo.page,
    };
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
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
