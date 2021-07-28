import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import shortid from 'shortid';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

// ADD POST
function addPostAPI(data) {
  return axios.post(`/api/post/${data.postId}/comment`, data);
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data); // action에서 data꺼내서 addPostAPI로 들어감
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    const id = shortid.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      data: {
        id,
        content: action.data,
      },
    });
    yield put({
      // 위 ADD_POST_SUCCESS에서 넣은 id를 ADD_POST_TO_ME에서 data로 넣음
      type: ADD_POST_TO_ME,
      data: id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

// REMOVE POST
function removePostAPI(data) {
  return axios.post(`/api/delete`, data);
}

function* removePost(action) {
  try {
    // const result = yield call(addPostAPI, action.data); // action에서 data꺼내서 addPostAPI로 들어감
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      // post reducer 조작부분
      type: REMOVE_POST_SUCCESS,
      data: action.data, // 게시글을 지울 땐 이미 action.data에 게시글에 대한 id가 포함되어 있음
    });
    yield put({
      // user reducer 조작부분
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

// ADD COMMENT
function addCommentAPI(data) {
  return axios.post('/api/comment', data);
}

function* addComment(action) {
  try {
    // const result = yield call(addPostAPI, action.data); // action에서 data꺼내서 addPostAPI로 들어감
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost); // 3초안의 같은 요청은 무시
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost); // 3초안의 같은 요청은 무시
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment); // 3초안의 같은 요청은 무시
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchRemovePost), fork(watchAddComment)]);
}
