const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models');
const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // 서버에러(err), 성공(user), 정보(info)
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason); // 401 허가되지 않음
    }
    return req.login(user, async loginErr => {
      // 내 서비스의 에러가 아닌 passport의 에러, serialize에서 done(null, user.id) 제대로 안적어주 면 뜸
      if (loginErr) {
        console.error('loginErr :', loginErr);
        return next(loginErr);
      }
      console.log('전송되는 user:', user); // serialize돼서 user.id만 출력됨
      return res.status(200).json(user);
    });
  })(req, res, next); // (req, res, next)를 사용하기 위해 middleware의 확장
}); // 로그인 한 뒤 부턴 req.user에 정보가 들어있음

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
      password: hashedPassword,
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send('ok');
  } catch (error) {
    console.error(error);
    next(error); // req, res, next의 next를 통해서 error를 보내면 에러가 한번에 처리됨 next(error) == status(500)
  }
});

router.post('/user/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

module.exports = router;
