import * as homeCtrl from "../controller/home-controller.js";
import express from "express";
const home = express.Router();
import multer from "multer";
const upload = multer();

home.get("/", homeCtrl.renderHome);
home.get("/logout", homeCtrl.userLogout);
home
  .route("/login")
  .get(homeCtrl.renderLoginForm)
  .post(upload.none(), homeCtrl.userLogin);

export default home;
