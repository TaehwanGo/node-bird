import { all, fork } from 'redux-saga/effects';

import postSaga from './post';
import userSaga from './user';

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]); // 처음에 이벤트 리스너들을 등록하는 것 처럼 모두 등록
}
