const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // app.js 에서 실행 됨
  passport.serializeUser((user, done) => {
    // req.login() 한 다음 실행 됨(serialize) : session에 user정보를 다 저장하는게 아니라 cookie랑 묶어줄 user id만 저장
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      await User.findOne({ where: { id } }); // 세션에 저장된 id로 조회를 해서 user정보를 복구
      done(null, user); // cookie로 부터 받은 user id로 db에서 user를 복구해서 req.user안에 넣어줌
    } catch (error) {
      console.error(error);
      done(error); // passport는 done으로 에러처리
    }
  });

  local();
};
