import * as usersCtrl from "../controller/users-controller.js";
import User from "../models/User.js";
import * as util from "../utils.js";
import express from "express";
const users = express.Router();
import multer from "multer";
const upload = multer();

users.route("/").post(upload.none(), usersCtrl.createUser);

users.get("/register", usersCtrl.renderRegisterForm);

users
  .route("/:object_id")
  .get(util.isLogged, checkPermission, usersCtrl.renderUser)
  .put(util.isLogged, checkPermission, upload.none(), usersCtrl.updateUser);

users.get(
  "/:object_id/edit",
  util.isLogged,
  checkPermission,
  usersCtrl.renderEditUser
);

export default users;

function checkPermission(req, res, next) {
  User.findOne({ _id: req.params.object_id }, function (err, user) {
    if (err) return res.json(err);
    if (user._id.toString() != req.user._id.toString())
      return util.noPermission(req, res);
    next();
  });
}
