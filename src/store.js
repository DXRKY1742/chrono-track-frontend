// Redux
import { configureStore } from '@reduxjs/toolkit';
// Components
import authSlice from './features/authSlice';
// import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    // user: userReducer,
  },
  
});

export default store;
