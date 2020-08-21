import * as usersCtrl from "../controller/users-controller";
import User from "../models/User";
import utils from "../utils";
import express from "express";
const users = express.Router();
import multer from "multer";
const upload = multer();

users.route("/").post(upload.none(), usersCtrl.createUser);

users.get("/register", usersCtrl.renderRegisterForm);

users
  .route("/:object_id")
  .get(usersCtrl.renderUser)
  .put(utils.isLogged, checkPermission, upload.none(), usersCtrl.updateUser);

users.get(
  "/:object_id/edit",
  utils.isLogged,
  checkPermission,
  usersCtrl.renderEditUser
);

export default users;

function checkPermission(req, res, next) {
  User.findOne({ _id: req.params.object_id }, function (err, user) {
    if (err) return res.json(err);
    if (user._id.toString() != req.user._id.toString())
      return utils.noPermission(req, res);
    next();
  });
}
