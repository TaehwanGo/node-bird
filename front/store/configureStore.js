import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import reducer from '../reducers';

// action이 dispatch 되는 것을 logging하는 미들웨어
const loggerMiddleware =
  ({ dispatch, getState }) =>
  next =>
  action => {
    console.log(action);
    // if (typeof action === 'function') {
    //   return action(dispatch, getState);
    // }

    return next(action);
  };

const configureStore = () => {
  const middlewares = [thunkMiddleware, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancer);
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
}); // debug가 true이면 리덕스에 대한 설명이 더 자세히 나옴

export default wrapper;
