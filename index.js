// node_modules에서 가져온다
const express = require('express');
// 뭐가 리턴되는지 모르겠지만 객체가 리턴되서 웹 서버를 
// 작동시킬 수 있게 해준다.
const app = express();
// 서버의 포트번호
const port = 3000;

// view engine으로 ejs를 사용하겠다
app.set('view engine', 'ejs');

/*asdas

d
dasdasd
asdasd

*/
// routes/home.js를 exports한 덕분에 require로 router를
// 불러올 수 있다.
// const router = express.Router();
// router.get('/', (req, res)=> {
//     res.render('home/main');
// });
// app.use('/', router);
// 위의 5줄과 아래 1줄은 똑같은 역할을 한다.
// 코드의 가독성, 유지보수 등 유리한 점이 많아진다.

app.use('/', require('./routes/home'));

// 서버 실해
app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
});