export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: 'tony',
      },
      content: '첫 번째 게시글 #헤시태그 #익스프레스',
      Image: [
        {
          src: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        },
        {
          src: 'https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg',
        },
        {
          src: 'https://media.vlpt.us/images/jongbeen_song/post/174477f5-01a8-4e7a-94c8-4801e36dbb06/111111111.png',
        },
      ],
      Comment: [
        {
          User: {
            nickname: 'taehwan',
          },
          content: 'free to focus',
        },
        {
          User: {
            nickname: 'noah',
          },
          content: 'let us get it',
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

const ADD_POST = 'ADD_POST'; // 상수로 만들면 switch문에서 case에서 재사용 가능, 오타방지
export const addPost = {
  type: ADD_POST,
};
const dummyPost = {
  id: 2,
  content: '더미데이터입니다.',
  User: {
    id: 1,
    nickname: 'tony',
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], // 앞에 추가해야 위로 올라감
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
