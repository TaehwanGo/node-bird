const express = require('express');

const router = express.Router();
router.post('/', (req, res) => {
  console.log('req data : ', req);
  console.log('headers : ', req.headers);
  console.log('body', req.body);
  res.json({ id: 1, content: 'formTest' });
});

module.exports = router;
