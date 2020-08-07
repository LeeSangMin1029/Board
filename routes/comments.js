import * as commentCtrl from "../controller/comment-controller.js";
import * as util from "../utils.js";
import express from "express";
const comments = express.Router();
import multer from "multer";
const upload = multer();

comments.post(
  "/",
  util.isLogged,
  upload.none(),
  commentCtrl.checkPostId,
  commentCtrl.createComment
);

comments
  .route("/:object_id")
  .put(
    util.isLogged,
    upload.none(),
    commentCtrl.checkPostId,
    commentCtrl.updateComment
  )
  .delete(util.isLogged, commentCtrl.destoryComment);

export default comments;
