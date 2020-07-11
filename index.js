const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

require("dotenv").config();
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
  // const Post = require("./models/Post");
  // if ((await Post.countDocuments().exec()) > 0) return;
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

app.set("view engine", "ejs");
app.use("/static", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
