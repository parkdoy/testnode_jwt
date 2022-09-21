require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");

app.use(express.json());
//app.use('/',express.static(__dirname + "index.html"));

//get  웹페이지 경로요청, html,css,js 등의 정보를 가져온다
//post id, password 값을 통한 확인
//delete 삭제
//put 업데이트

const posts = [
    {
        username: 'doyoung',
        title: 'Post 1',
    },
    {

    }

];

/* 미들웨어 */
//모든 서버의 요청은 use을 통과한다. 처리가 끝난다음 next로 넘어간다.
//app.use(express.static(__dirname +"/public"));

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
  });

app.post("/login",(req,res)=>{
    //authenticate User

    const username =req.body.username;
    const user = { name : user };

    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken : accessToken});

});

/* Bearer token  */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

app.listen(port,(err) => {
    if(err) return console.log(err);
    console.log("서버가동");
});
