import axios from 'axios';
import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';
import {
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
} from '../reducers/user';

// 로그인
// function loginAPI(data) {
//   // 제너레이터 아님, 실제로 서버에 요청을 보냄
//   return axios.post('/api/login', data);
// }

function* login(action) {
  try {
    // call(loginAPI, action.data, a, b, c) == await loginAPI(action.data, a, b, c)
    // const result = yield call(loginAPI, action.data);
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data, // 일단 서버연결 전까지 login request에서 보낸 것을 바로 success로 보냄
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

// 로그아웃
function logoutAPI() {
  return axios.post('/api/logout');
}

function* logout() {
  try {
    // const result = yield call(logoutAPI);
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: LOG_OUT_SUCCESS,
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      data: err.response.data,
    });
  }
}

// SignUp
function signUpAPI() {
  return axios.post('/api/signUp');
}

function* signUp() {
  try {
    // const result = yield call(logoutAPI);
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: SIGN_UP_SUCCESS,
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      data: err.response.data,
    });
  }
}

// follow
function followAPI() {
  return axios.post('/api/follow');
}

function* follow(action) {
  try {
    // const result = yield call(logoutAPI);
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      data: err.response.data,
    });
  }
}

// unfollow
function unfollowAPI() {
  return axios.post('/api/unfollow');
}

function* unfollow(action) {
  try {
    // const result = yield call(logoutAPI);
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      data: err.response.data,
    });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login);
}

function* watchLogout() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogin),
    fork(watchLogout),
    fork(watchSignUp),
  ]);
}
