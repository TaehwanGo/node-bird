const express = require('express');
const postRouter = require('./routes/post');

const app = express();

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

app.listen(3065, () => {
  console.log('서버 실행 중');
});
