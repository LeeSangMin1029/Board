import * as postsCtrl from "../controller/posts-controller.js";
import * as util from "../utils.js";
import express from "express";
const posts = express.Router();
import multer from "multer";
const upload = multer();

posts
  .route("/")
  .get(postsCtrl.getQueryString, postsCtrl.renderPosts)
  .post(util.isLogged, upload.none(), postsCtrl.createPost);

posts
  .route("/page/:page")
  .get(postsCtrl.getQueryString, postsCtrl.getPaginatedPosts);

posts.get("/new", util.isLogged, postsCtrl.renderNewPost);

posts
  .route("/:id")
  .get(postsCtrl.renderPost)
  .put(
    util.isLogged,
    postsCtrl.checkPermission,
    upload.none(),
    postsCtrl.updatePost
  )
  .delete(util.isLogged, postsCtrl.checkPermission, postsCtrl.deletePost);

posts.get(
  "/:id/edit",
  util.isLogged,
  postsCtrl.checkPermission,
  postsCtrl.renderEditPost
);

export default posts;
