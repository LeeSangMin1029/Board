import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import * as util from "../utils.js";

// 사용자가 글을 생성할 수 있는 폼을 가진 페이지를 그려준다
const renderNewPost = (req, res) => {
  try {
    return res.render("posts/new");
  } catch (err) {
    return res.send(err);
  }
};

// 사용자가 글을 수정가능한 페이지를 그려준다.
const renderEditPost = util.asyncWrap(async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).lean();
    return res.render("posts/edit", { post: post });
  } catch (err) {
    return res.send(err);
  }
});

// 글을 생성하는데 필요한 요소를 입력하고 Create
// 버튼을 눌렀을 때 실행되는 함수이다. DB에 실제로
// 사용자가 넣은 정보들이 저장되고, 글 목록을 보여주는 페이지로 이동
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
        .sort("-createdAt")
        .lean()
        .populate({ path: "author", options: { lean: true, limit: limit } })
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

// 글의 상세 페이지를 찾아서 출력
const renderPost = util.asyncWrap(async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .lean()
      .populate({ path: "author", options: { lean: true } });
    const comments = await Comment.find({ post: req.params.id })
      .sort("createdAt")
      .lean()
      .populate({ path: "author", select: "name", options: { lean: true } });
    const payload = { ...post };
    payload.createdAt = util.dateFormatting({
      date: payload.createdAt,
      formatString: "YYYY-MM-DD HH:mm:ss",
    });
    payload.updatedAt = util.dateFormatting({
      date: payload.updatedAt,
      formatString: "YYYY-MM-DD HH:mm:ss",
    });
    return res.render("posts/post", { post: payload, comments: comments });
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

// 글을 실제 DB에서 삭제하는 함수
const deletePost = util.asyncWrap(async (req, res) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.id });
    return res.json({ redirect: true });
  } catch (err) {
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
    // 생성일 Formmating
    post.createdAt = util.dateFormatting({
      date: post.createdAt,
      formatString: "YYYY-MM-DD",
    });
    return post;
  });
}

const checkPermission = util.asyncWrap(async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (post.author != req.user._id) return util.noPermission(req, res);
    next();
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
