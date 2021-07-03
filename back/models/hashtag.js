module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    'Hashtag',
    {
      // 모델이름이 MySQL엔 users로 소문자+복수로 저장됨
      // id가 기본적으로 들어있음(MySQL에서 순차적으로 자동으로 생성됨)
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4', // emoji를 쓰기 위해선 mb4를 넣어줘야함
      collate: 'utf8mb4_general_ci', // 한글저장을 위한 설정
    },
  );
  Hashtag.associate = db => {};
  return Hashtag;
};
