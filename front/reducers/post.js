import shortId from 'shortid';

export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: 'tony',
      },
      content: '첫 번째 게시글 #헤시태그 #익스프레스',
      Images: [
        {
          id: shortId.generate(),
          src: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        },
        {
          id: shortId.generate(),
          src: 'https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg',
        },
        {
          id: shortId.generate(),
          src: 'https://media.vlpt.us/images/jongbeen_song/post/174477f5-01a8-4e7a-94c8-4801e36dbb06/111111111.png',
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: 'taehwan',
          },
          content: 'free to focus',
        },
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: 'noah',
          },
          content: 'let us get it',
        },
      ],
    },
  ],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST'; // 상수로 만들면 switch문에서 case에서 재사용 가능, 오타방지
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST'; // 상수로 만들면 switch문에서 case에서 재사용 가능, 오타방지
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const addPost = data => ({
  // 동적 action creator
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = data => ({
  // 동적 action creator
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = data => ({
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: 'tony',
  },
  Images: [],
  Comments: [],
});

const dummyComment = data => ({
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: 'tony',
  },
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      // console.log('ADD_POST_SUCCESS', action.data);
      return {
        ...state,
        mainPosts: [dummyPost(action.data), ...state.mainPosts], // 앞에 추가해야 위로 올라감
        addPostLoading: false,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case REMOVE_POST_REQUEST:
      return {
        ...state,
        removePostLoading: true,
        removePostDone: false,
        removePostError: null,
      };
    case REMOVE_POST_SUCCESS:
      console.log('REMOVE_POST_SUCCESS, state.mainPosts', state.mainPosts);
      console.log('REMOVE_POST_SUCCESS', action.data);
      return {
        ...state,
        mainPosts: state.mainPosts.filter(post => post.id !== action.data),
        removePostLoading: false,
        removePostDone: true,
      };
    case REMOVE_POST_FAILURE:
      return {
        ...state,
        removePostLoading: false,
        removePostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS: {
      // action.data.content, postId, userId 를 받음
      // 불변성을 지키기 위한 코드 : 바뀌는 것만 새로운 객체로 만들고 나머지 객체는 참조를 유지해줘야 함
      // 불변성을 편하게 할 수 있는 라이브러리 : 이머
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId,
      );
      const post = { ...state.mainPosts[postIndex] };
      post.Comments = [dummyComment(action.data.content), ...post.Comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = post;
      return {
        ...state,
        mainPosts,
        addCommentLoading: false,
        addCommentDone: true,
      };
    }
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
