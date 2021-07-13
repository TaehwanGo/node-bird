import { createWrapper } from 'next-redux-wrapper';
import { createStore } from 'redux';

import reducer from '../reducers';

const configureStore = () => {
  // 일반 리덕스랑 비슷
  const store = createStore(reducer);
  store.dispatch({
    type: 'CHANGE_NICKNAME',
    data: 'taehwango',
  });
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
}); // debug가 true이면 리덕스에 대한 설명이 더 자세히 나옴

export default wrapper;
