const Post = require("../models/Post");
const util = require("../utils");
const moment = require("moment");

// 사용자가 글을 생성할 수 있는 폼을 가진 페이지를 그려준다
const renderNewPost = (req, res) => {
  const post = req.flash("post")[0] || {};
  const errors = req.flash("errors")[0] || {};
  res.render("posts/new", { post: post, errors: errors });
};

// 사용자가 글을 수정가능한 페이지를 그려준다.
const renderEditPost = async (req, res) => {
  const post = req.flash("post")[0];
  const errors = req.flash("errors")[0] || {};
  if (!post) {
    try {
      const post = await Post.findOne({ _id: req.params.id }).exec();
      res.render("posts/edit", { post: post, errors: errors });
    } catch (err) {
      res.send(err);
    }
  } else {
    post._id = req.params.id;
    res.render("posts/edit", { post: post, errors: errors });
  }
};

// 글을 생성하는데 필요한 요소를 입력하고 Create
// 버튼을 눌렀을 때 실행되는 함수이다. DB에 실제로
// 사용자가 넣은 정보들이 저장되고, 글 목록을 보여주는 페이지로 이동
const createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      body: req.body.postBody,
    });
    const postSave = post.save();
    res.redirect("/posts");
  } catch (err) {
    req.flash("post", req.body);
    req.flash("errors", util.errorHandler(err));
    res.redirect("/posts/new");
  }
};

// 글 목록을 생성된 순서대로 페이지에 출력한다
const getPosts = async (req, res) => {
  try {
    const page = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = 5;

    if (page) {
      const startIndex = (page - 1) * limit;
      const posts = await Post.find()
        .limit(limit)
        .skip(startIndex)
        .sort("-createdAt")
        .lean();
      const postCount = await Post.countDocuments().exec();
      const pageCount = (postCount / limit) | 0;
      return res.json({ posts: posts, count: pageCount });
    }
    res.render("posts/index");
  } catch (err) {
    res.send(err);
  }
};

// 글의 상세 페이지를 찾아서 출력
const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).exec();
    res.render("posts/post", { post: post, moment: moment });
  } catch (err) {
    res.json(err);
  }
};

// 글을 수정하는 페이지에서 수정 후에 Edit 버튼을 눌렀을 때
// 해당 함수가 실행되고 수정된 글로 다시 이동
const updatePost = async (req, res) => {
  const postPayload = {
    title: req.body.title,
    body: req.body.postBody,
    updatedAt: Date.now(),
  };
  try {
    Post.findOneAndUpdate({ _id: req.params.id }, postPayload, {
      runValidators: true,
    }).exec();
    res.redirect("/posts/" + req.params.id);
  } catch (err) {
    req.flash("post", postPayload);
    req.flash("errors", util.errorHandler(err));
    res.redirect("/posts/" + req.params.id + "/edit");
  }
};

// 글을 실제 DB에서 삭제하는 함수
const deletePost = async (req, res) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.id }).exec();
    res.redirect("/posts");
  } catch (err) {
    res.json(err);
  }
};

module.exports = {
  renderNewPost: renderNewPost,
  renderEditPost: renderEditPost,
  createPost: createPost,
  getPost: getPost,
  getPosts: getPosts,
  updatePost: updatePost,
  deletePost: deletePost,
};
