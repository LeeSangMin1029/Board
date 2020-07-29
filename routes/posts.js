import * as postsCtrl from "../controller/posts-controller.js";
import express from "express";
const posts = express.Router();
import multer from "multer";
const upload = multer();

posts
  .route("/")
  .get(postsCtrl.rePaginatedPosts)
  .post(util.isLogged, upload.none(), postsCtrl.createPost);

posts.route("/page/:page").get(postsCtrl.getPaginatedPosts);

posts.get("/new", util.isLogged, postsCtrl.renderNewPost);

posts
  .route("/:id")
  .get(util.isLogged, postsCtrl.renderPost)
  .put(util.isLogged, checkPermission, upload.none(), postsCtrl.updatePost)
  .delete(util.isLogged, checkPermission, postsCtrl.deletePost);

posts.get(
  "/:id/edit",
  util.isLogged,
  checkPermission,
  postsCtrl.renderEditPost
);

export default posts;

function checkPermission(req, res, next) {
  Post.findOne({ _id: req.params.id }, function (err, post) {
    if (err) return res.json(err);
    if (post.author != req.user.id) return util.noPermission(req, res);

    next();
  });
}
