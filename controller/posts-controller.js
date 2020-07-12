const Post = require("../models/Post");
const util = require("../utils");

// 사용자가 글을 생성할 수 있는 폼을 가진 페이지를 그려준다
const renderNewPost = (req, res) => {
  return res.render("posts/new");
};

// 사용자가 글을 수정가능한 페이지를 그려준다.
const renderEditPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).lean();
    return res.render("posts/edit", { post: post });
  } catch (err) {
    return res.send(err);
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
    await post.save();
    return res.redirect("/posts");
  } catch (err) {
    return res.redirect("/posts/new");
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
      const postLength = await Post.countDocuments();
      const pageCount = util.getPageCount(postLength, limit);
      return res.json({ posts: posts, count: pageCount });
    } else {
      return res.render("posts/index");
    }
  } catch (err) {
    return res.send(err);
  }
};

// 글의 상세 페이지를 찾아서 출력
const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).lean();
    const payload = { ...post };
    const createdDate = {
      date: payload.createdAt,
      formatString: "YYYY-MM-DD HH:mm:ss",
    };
    payload.createdAt = util.dateFormatting(createdDate);
    const updatedDate = {
      date: payload.updatedAt,
      formatString: "YYYY-MM-DD HH:mm:ss",
    };
    payload.updatedAt = util.dateFormatting(updatedDate);
    return res.render("posts/post", { post: payload });
  } catch (err) {
    return res.json(err);
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
    await Post.findOneAndUpdate({ _id: req.params.id }, postPayload, {
      runValidators: true,
    });
    return res.redirect("/posts/" + req.params.id);
  } catch (err) {
    return res.redirect("/posts/" + req.params.id + "/edit");
  }
};

// 글을 실제 DB에서 삭제하는 함수
const deletePost = async (req, res) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.id });
    return res.redirect("/posts");
  } catch (err) {
    return res.json(err);
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
