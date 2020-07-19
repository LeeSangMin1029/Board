import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Post from "./models/Post.js";
const __dirname =
  path.dirname(new URL(import.meta.url).pathname).slice(1) + "/";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

mongoose.connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.once("open", async () => {
  // if (await Post.countDocuments().exec() > 0) return;
  // Promise.all([
  //   Post.create({ title: "title1", body: "body1" }),
  //   Post.create({ title: "title2", body: "body2" }),
  //   Post.create({ title: "title3", body: "body3" }),
  //   Post.create({ title: "title4", body: "body4" }),
  //   Post.create({ title: "title5", body: "body5" }),
  //   Post.create({ title: "title6", body: "body6" }),
  //   Post.create({ title: "title7", body: "body7" }),
  //   Post.create({ title: "title8", body: "body8" }),
  //   Post.create({ title: "title9", body: "body9" }),
  //   Post.create({ title: "title10", body: "body10" }),
  //   Post.create({ title: "title11", body: "body11" }),
  //   Post.create({ title: "title12", body: "body12" }),
  //   Post.create({ title: "title13", body: "body13" }),
  // ]).then(() => {
  //   console.log("finish");
  // });

  console.log("DB connected");
});
db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

app.set("view engine", "pug");
app.use("/static", express.static(`${__dirname}public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// route setting
import home from "./routes/home.js";
import posts from "./routes/posts.js";

app.use("/", home);
app.use("/posts", posts);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
