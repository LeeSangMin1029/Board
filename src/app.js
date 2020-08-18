import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import mongoose from "mongoose";
import session from "express-session";
import config from "./config";

// route setting
import home from "./routes/home";
import posts from "./routes/posts";
import users from "./routes/users";
import comments from "./routes/comments";

const app = express();

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
app.set("views", `${config.dirname}/views`);
app.use("/static", express.static(`${config.dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(config.passport.initialize());
app.use(config.passport.session());
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use("/", home);
app.use("/posts", posts);
app.use("/users", users);
app.use("/comment", comments);

app.listen(config.port, () => {
  console.log(`http://localhost:${config.port}`);
});
