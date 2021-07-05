const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        // 조건
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
      // status(상태코드) 도 header에 포함됨
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 2번째 param인 숫자 : hash정도 숫자가 높을 수록 보안이 높지만 시간이 오래걸림(10~13 정도 줌)
    // POST방식의 '/user/'
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: req.body.password,
    });
    res.status(200).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // req, res, next의 next를 통해서 error를 보내면 에러가 한번에 처리됨 next(error) == status(500)
  }
});

module.exports = router;
