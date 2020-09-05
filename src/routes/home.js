import * as homeCtrl from "../controller/home-controller";
import utils from "../utils";
import express from "express";
const home = express.Router();
import multer from "multer";
const upload = multer();

home.get("/", homeCtrl.renderHome);
home.get("/logout", homeCtrl.userLogout);
home
  .route("/login")
  .get(utils.isNotLogged, homeCtrl.renderLoginForm)
  .post(utils.isNotLogged, upload.none(), homeCtrl.userLogin);

export default home;
