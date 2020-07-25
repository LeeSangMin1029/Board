import * as usersCtrl from "../controller/users-controller.js";
import express from "express";
const users = express.Router();
import multer from "multer";
const upload = multer();

users
  .route("/")
  .get(usersCtrl.getUsers)
  .post(upload.none(), usersCtrl.createUser);
users.get("/register", usersCtrl.renderRegisterForm);

export default users;
