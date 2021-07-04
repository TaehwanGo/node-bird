module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      // 모델이름이 MySQL엔 users로 소문자+복수로 저장됨
      // id가 기본적으로 들어있음(MySQL에서 순차적으로 자동으로 생성됨)
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4', // emoji를 쓰기 위해선 mb4를 넣어줘야함
      collate: 'utf8mb4_general_ci', // 한글저장을 위한 설정
    },
  );
  Post.associate = db => {
    db.Post.belongsTo(db.User); // post의 작성자
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post에 좋아요를 누른 사람
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // retweet - belongsTo는 PostId를 만드는데 이러면 햇갈리므로 retweetId로 변경
  };
  return Post;
};
