import * as postsCtrl from "../controller/posts-controller.js";
import express from "express";
const posts = express.Router();
import multer from "multer";
const upload = multer();

posts
  .route("/")
  .get(postsCtrl.rePaginatedPosts)
  .post(upload.none(), postsCtrl.createPost);
posts.route("/page/:page").get(postsCtrl.getPaginatedPosts);
// posts/create의 경로로 get요청이 오면 새로 페이지를 그려준다.
posts.get("/new", postsCtrl.renderNewPost);
posts
  .route("/:id")
  .get(postsCtrl.getPost)
  .put(upload.none(), postsCtrl.updatePost)
  .delete(postsCtrl.deletePost);
posts.get("/:id/edit", postsCtrl.renderEditPost);

export default posts;
