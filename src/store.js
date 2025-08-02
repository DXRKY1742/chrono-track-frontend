// Redux
import { configureStore } from '@reduxjs/toolkit';
// Components
import authSlice from './features/authSlice';
import themeReducer from './features/themeSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    theme: themeReducer
  },
  
});

export default store;
