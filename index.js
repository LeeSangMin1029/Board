// node_modules에서 가져온다
const express = require("express");
// 뭐가 리턴되는지 모르겠지만 객체가 리턴되서 웹 서버를
// 작동시킬 수 있게 해준다.
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
// mongoose를 사용할 수 있게 npm에서 가져온다.
const mongoose = require("mongoose");
const Post = require("./models/Post");
// 서버의 포트번호

require("dotenv").config();

// view engine으로 ejs를 사용하겠다
app.set("view engine", "ejs");

// DB 설정
// test라는 db 생성
mongoose.connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.once("open", async () => {
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

// 이미지, CSS 파일 및 javascript 파일과 같은 정적 파일을
// 가져다가 사용할 수 있다.
app.use("/static", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// RESTful API의 7가지 패턴 중 변경된 정보를 업데이트하는 Put method와
// 데이터를 삭제하는 Delete method는 HTML에서 지원하지 않는다.
// app.post를 사용할 수도 있지만 RESTful API 패턴에는 맞지 않기 때문에
// 이걸 사용한다.
app.use(methodOverride("_method"));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRETKEY,
    resave: false,
    saveUninitialized: true,
  })
);

// routes/home.js를 exports한 덕분에 require로 router를
// 불러올 수 있다.
// const router = express.Router();
// router.get('/', (req, res)=> {
//     res.render('home/main');
// });
// app.use('/', router);
// 위의 5줄과 아래 1줄은 똑같은 역할을 한다.
// 코드의 가독성, 유지보수 등 유리한 점이 많아진다.

app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
