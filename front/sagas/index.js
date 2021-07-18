import {
  all,
  call,
  delay,
  fork,
  put,
  takeLatest,
  throttle,
} from 'redux-saga/effects';
import axios from 'axios';

// 로그인
function loginAPI(data) {
  // 제너레이터 아님, 실제로 서버에 요청을 보냄
  return axios.post('/api/login', data);
}

function* login(action) {
  try {
    // call(loginAPI, action.data, a, b, c) == await loginAPI(action.data, a, b, c)
    // const result = yield call(loginAPI, action.data);
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: 'LOG_IN_SUCCESS',
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_IN_FAILURE',
      data: err.response.data,
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
      type: 'LOG_OUT_SUCCESS',
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_OUT_FAILURE',
      data: err.response.data,
    });
  }
}

// ADD POST
function addPostAPI(data) {
  return axios.post('/api/post', data);
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data); // action에서 data꺼내서 addPostAPI로 들어감
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: 'ADD_POST_SUCCESS',
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'ADD_POST_FAILURE',
      data: err.response.data,
    });
  }
}

function* watchLogin() {
  // 비동기 action 크리에이터
  yield takeLatest('LOG_IN_REQUEST', login); // login이 매개변수를 포함해서 실행하는 것
}

function* watchLogout() {
  yield takeLatest('LOG_OUT_REQUEST', logout);
}

function* watchAddPost() {
  yield throttle('ADD_POST_REQUEST', addPost, 3000); // 3초안의 같은 요청은 무시
}

export default function* rootSaga() {
  yield all([fork(watchLogin), fork(watchLogout), fork(watchAddPost)]); // 처음에 이벤트 리스너들을 등록하는 것 처럼 모두 등록
}
