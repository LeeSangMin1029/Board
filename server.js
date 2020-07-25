import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
// route setting
import home from "./routes/home.js";
import posts from "./routes/posts.js";
import users from "./routes/users.js";

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

app.use("/", home);
app.use("/posts", posts);
app.use("/users", users);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
