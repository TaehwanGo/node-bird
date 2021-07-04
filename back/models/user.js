module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      // 모델이름이 MySQL엔 users로 소문자+복수로 저장됨
      // id가 기본적으로 들어있음(MySQL에서 순차적으로 자동으로 생성됨)
      email: {
        // DB column 속성
        type: DataTypes.STRING(30),
        allowNull: false, // false는 필수로 필요로 한 것
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100), // 암호화되면 길이가 길어지므로
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', // 한글저장을 위한 설정(utf8)
    },
  );
  User.associate = db => {
    db.User.hasMany(db.Post); // 작성한 게시글들
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // 좋아요를 누른 게시글들
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'FollowingId',
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'FollowerId',
    });
  };
  return User;
};
