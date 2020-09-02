import * as postsCtrl from "../controller/posts-controller";
import utils from "../utils";
import express from "express";
const posts = express.Router();
import multer from "multer";
const upload = multer();

posts
  .route("/")
  .get(postsCtrl.getQueryString, postsCtrl.renderPosts)
  .post(utils.isLogged, upload.none(), postsCtrl.createPost);

posts.get("/new", utils.isLogged, postsCtrl.renderNewPost);

posts
  .route("/:id")
  .get(postsCtrl.renderPost)
  .put(
    utils.isLogged,
    postsCtrl.checkPermission,
    upload.none(),
    postsCtrl.updatePost
  )
  .delete(utils.isLogged, postsCtrl.checkPermission, postsCtrl.deletePost);

posts.get(
  "/:id/edit",
  utils.isLogged,
  postsCtrl.checkPermission,
  postsCtrl.renderEditPost
);

export default posts;
