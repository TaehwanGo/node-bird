import shortId from 'shortid';
import produce from 'immer';

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

// 이전 상태를 액션을 통해 다음 상태로 만들어 내는 함수(불변성은 지키면서)
const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(dummyPost(action.data));
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.mainPosts = draft.mainPosts.filter(
          post => post.id !== action.data,
        );
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        // 이 부분 때문에 immer를 썻다고 해도 과언이 아님
        const post = draft.mainPosts.find(v => v.id === action.data.postId);
        post.Comments.unshift(dummyComment(action.data.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
