const Post = require("../models/Post");
const moment = require("moment");

// 사용자가 글을 생성할 수 있는 폼을 가진 페이지를 그려준다
const renderNewPost = (req, res) => {
  res.render("posts/new");
};

// 사용자가 글을 수정가능한 페이지를 그려준다.
const renderEditPost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .exec()
    .then((post) => {
      res.render("posts/edit", { post: post });
    })
    .catch((err) => {
      return res.json(err);
    });
};

// 글을 생성하는데 필요한 요소를 입력하고 Create
// 버튼을 눌렀을 때 실행되는 함수이다. DB에 실제로
// 사용자가 넣은 정보들이 저장되고, 글 목록을 보여주는 페이지로 이동
const createPost = (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.postBody,
  });
  post
    .save()
    .then(() => {
      res.redirect("/posts");
    })
    .catch((err) => {
      return res.redirect("/posts/new");
    });
};

// 글 목록을 생성된 순서대로 페이지에 출력한다
const getPosts = (req, res) => {
  Post.find({})
    .sort("-createdAt")
    .exec()
    .then((posts) => {
      res.render("posts/index", { posts: posts, moment: moment });
    })
    .catch((err) => {
      return res.send(err);
    });
};

// 글의 상세 페이지를 찾아서 출력
const getPost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .exec()
    .then((post) => {
      res.render("posts/post", { post: post });
    })
    .catch((err) => {
      return res.json(err);
    });
};

// 글을 수정하는 페이지에서 수정 후에 Edit 버튼을 눌렀을 때
// 해당 함수가 실행되고 수정된 글로 다시 이동
const updatePost = (req, res) => {
  // req안에 들어있는 body변수를 꺼낸다?
  const { body } = req;
  const postPayload = { ...body, updatedAt: Date.now() };
  Post.findOneAndUpdate({ _id: req.params.id }, postPayload)
    .exec()
    .then(() => {
      res.redirect("/posts/" + req.params.id);
    })
    .catch((err) => {
      return res.json(err);
    });
};

// 글을 실제 DB에서 삭제하는 함수
const deletePost = (req, res) => {
  Post.findOneAndDelete({ _id: req.params.id })
    .exec()
    .then(() => {
      res.redirect("/posts");
    })
    .catch((err) => {
      return res.json(err);
    });
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
