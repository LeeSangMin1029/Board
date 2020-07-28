import * as usersCtrl from "../controller/users-controller.js";
import express from "express";
const users = express.Router();
import multer from "multer";
const upload = multer();

users
  .route("/")
  .get(usersCtrl.renderUsers)
  .post(upload.none(), usersCtrl.createUser);
users.get("/register", usersCtrl.renderRegisterForm);
users
  .route("/:object_id")
  .get(usersCtrl.renderUser)
  .put(upload.none(), usersCtrl.updateUser)
  .delete(usersCtrl.deleteUser);
users.get("/:object_id/edit", usersCtrl.renderEditUser);

export default users;
