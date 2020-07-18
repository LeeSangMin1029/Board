import express from "express";
const home = express.Router();

home.get("/", (req, res) => {
  res.render("home/main");
});

export default home;
