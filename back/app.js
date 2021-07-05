const express = require('express');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const db = require('./models'); // dir를 가져오면 자동으로 그 안의 index를 찾아서 가져옴

const app = express();

// sequelize.sync() : promise
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

app.use(express.json()); // front에서 json형태의 data를 보낼때 그것을 req.body에 넣어줌
app.use(express.urlencoded({ extended: true })); // form&submit을 하면 url encoded방식으로 data가 넘어오는데 그것을 req.body에 넣어줌

app.get('/api/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello' },
    { id: 3, content: 'hello' },
  ]);
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/post', postRouter); // 중복된 요소를 뽑아 줄 수 있음
app.use('/user', userRouter);

app.listen(3065, () => {
  console.log('서버 실행 중');
});
