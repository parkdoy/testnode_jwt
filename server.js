require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const User = require("./model/user");
const bodyParser = require('body-parser');
const { PORT, MONGO_URI } = process.env;
const bcrypt = require('bcryptjs');

const JWT_SECRET = "asdfihoiadfsoidnq84dk1anrj23sjwj9rjsk" //공개되지 않도록 주의 매우 중요함..

// CONNECT TO MONGODB SERVER
mongoose
  .connect(MONGO_URI,{

    /* 이부분 에러->6버전 부터는 지원하지 않는다는데 해결방법 잘 모름 */
    //useNewUrlParser: false,
    //useUnifiedTopology: false,
    //useCreateIndex: false

  })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

app.use('/', express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); //app.use(express.json()); //미들웨어


app.post("/api/login", async (req,res)=>{
  const { username , password} = req.body;
  const user = await User.findOne({ username}).lean();

  if(!user){
    return res.json({ status: 'error', error : "유효하지 않은 유저"})
  }

  if(await bcrypt.compare(password, user.password)){
    // 토큰 생성
    const token = jwt.sign({ 
      id : user._id,
      username: user.username,
    },
      JWT_SECRET
    )
    res.json({ status: 'ok' , data: 'token'});
  }
  res.json({ status: 'error', error : "유효하지 않은 유저"})
});

app.post("/api/resgister", async (req,res)=>{

  const { token, newpassword: plainTextPassword } = req.body
  
  /*아이디 비번 유효성 검사*/
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
});

app.listen(PORT,(err) => {
  if(err) return console.log(err);
  console.log("서버가동");
});

// const posts = [
//     {
//         username: 'doyoung',
//         title: 'Post 1',
//     },
//     {

//     }

// ];

/* 미들웨어 */
//모든 서버의 요청은 use을 통과한다. 처리가 끝난다음 next로 넘어간다.
//app.use(express.static(__dirname +"/public"));

// app.get('/posts', authenticateToken, (req, res) => {
//     res.json(posts.filter(post => post.username === req.user.name))
//   });

// app.post("/login",(req,res)=>{
//     //authenticate User

//     const username =req.body.username;
//     const user = { name : user };

//     const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
//     res.json({ accessToken : accessToken});

// });

// /* Bearer token  */
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//       console.log(err)
//       if (err) return res.sendStatus(403)
//       req.user = user
//       next()
//     })
//   }

