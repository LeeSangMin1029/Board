const { Router } = require("express");
const router = Router();
const Post = require("../models/Post");

// board의 메인 경로 /posts/
router.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render("posts/index", { posts: posts });
  });
});

// posts/create의 경로로 get요청이 오면 새로 페이지를 그려준다.
router.get("/new", (req, res) => {
  res.render("posts/new");
});

// post를 생성한다. form으로 전달한 데이터를 db에 저장한다.
router.post("/", (req, res) => {
  var post = new Post({ title: req.body.title, body: req.body.body });
  post.save(function (err) {
    if (err) return res.json(err);
    res.redirect("posts");
  });
});

router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }, function (err, post) {
    if (err) return res.json(err);
    res.render("posts/post", { post: post });
  });
});

router.get("/:id/edit", (req, res) => {
  Post.findOne({ _id: req.params.id }, function (err, post) {
    if (err) return res.json(err);
    res.render("posts/edit", { post: post });
  });
});

router.put("/:id", (req, res) => {
  req.body.updateAt = Date.now();
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, post) {
    if (err) return res.json(err);
    res.redirect("/posts/" + req.params.id);
  });
});

module.exports = router;
