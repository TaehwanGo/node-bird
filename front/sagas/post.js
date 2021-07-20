import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
} from '../reducers/post';

// ADD POST
function addPostAPI(data) {
  return axios.post(`/api/post/${data.postId}/comment`, data);
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data); // action에서 data꺼내서 addPostAPI로 들어감
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: ADD_POST_SUCCESS,
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
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
      //   data: result.data,
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

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment); // 3초안의 같은 요청은 무시
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchAddComment)]);
}
