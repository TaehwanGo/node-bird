// import axios from 'axios';
import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';

// 로그인
// function loginAPI(data) {
//   // 제너레이터 아님, 실제로 서버에 요청을 보냄
//   return axios.post('/api/login', data);
// }

function* login(action) {
  try {
    console.log('login gen');
    // call(loginAPI, action.data, a, b, c) == await loginAPI(action.data, a, b, c)
    // const result = yield call(loginAPI, action.data);
    yield delay(1000); // 서버가 없을 땐 delay로 비동기 적인 효과를 주면서 테스트
    yield put({
      type: 'LOG_IN_SUCCESS',
      data: action.data, // 일단 서버연결 전까지 login request에서 보낸 것을 바로 success로 보냄
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
// function logoutAPI() {
//   return axios.post('/api/logout');
// }

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

function* watchLogin() {
  // 비동기 action 크리에이터
  console.log('watch login');
  yield takeLatest('LOG_IN_REQUEST', login); // login이 매개변수를 포함해서 실행하는 것
}

function* watchLogout() {
  yield takeLatest('LOG_OUT_REQUEST', logout);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogout)]);
}
