const { Router } = require("express");
const router = Router();
const postsCtrl = require("../controller/posts-controller.js");
// const util = require("../utils");
// const Post = require("../models/Post");
// board의 메인 경로 /posts/
router.route("/").get(postsCtrl.getPosts).post(postsCtrl.createPost);
// posts/create의 경로로 get요청이 오면 새로 페이지를 그려준다.
router.get("/new", postsCtrl.renderNewPost);
router
  .route("/:id")
  .get(postsCtrl.getPost)
  .put(postsCtrl.updatePost)
  .delete(postsCtrl.deletePost);
router.get("/:id/edit", postsCtrl.renderEditPost);

module.exports = router;
