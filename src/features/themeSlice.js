// src/redux/themeSlice.js
const initialState = {
  currentTheme: 'saga-blue',
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'theme/set':
      return { ...state, currentTheme: action.payload };
    default:
      return state;
  }
};

export default themeReducer;
