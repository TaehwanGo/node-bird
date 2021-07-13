const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  post: {
    mainPosts: [],
  },
};

export const loginAction = data => {
  return {
    type: 'LOG_IN',
    data,
  };
};

export const logoutAction = () => {
  return {
    type: 'LOG_OUT',
  };
};

// (이전상태, 액션) => 다음상태
const rootReducer = (state = initialState, action) => {
  // Y 모양 처럼 두개를 받아서 하나로 축소를 함: 레듀샤
  switch (action.type) {
    case 'LOG_IN':
      return {
        // 항상 새로운 것을 만들어서 return
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case 'LOG_OUT':
      return {
        // 항상 새로운 것을 만들어서 return
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
  }
};

export default rootReducer;
