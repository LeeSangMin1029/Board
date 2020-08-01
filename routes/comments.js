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

export default comments;
