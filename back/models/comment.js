module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4', // emoji를 쓰기 위해선 mb4를 넣어줘야함
      collate: 'utf8mb4_general_ci', // 한글저장을 위한 설정
    },
  );
  Comment.associate = db => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};
