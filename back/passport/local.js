const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
  // passport/index.js 에서 실행 됨
  passport.use(
    new LocalStrategy(
      {
        // req.body.email & req.body.password
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email }, // email : email
          });
          if (!user) {
            // user가 없을 때
            // done(서버에러, 성공, 클라이언트 에러)
            return done(null, false, { reason: '존재하지 않는 이메일입니다.' });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            // 비밀번호 일치
            return done(null, user);
          }
        } catch (error) {
          // 서버에러인 경우
          console.error(error);
          return done(error);
        }
      },
    ),
  );
};
