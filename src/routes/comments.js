import * as commentCtrl from "../controller/comment-controller";
import utils from "../utils";
import express from "express";
const comments = express.Router();
import multer from "multer";
const upload = multer();

comments.post(
  "/",
  utils.isLogged,
  upload.none(),
  commentCtrl.checkPostId,
  commentCtrl.createComment
);

comments
  .route("/:object_id")
  .put(
    utils.isLogged,
    upload.none(),
    commentCtrl.checkPostId,
    commentCtrl.updateComment
  )
  .delete(utils.isLogged, commentCtrl.destoryComment);

export default comments;
