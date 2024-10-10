import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: {
      userData: JSON.parse(localStorage.getItem('userData')) || null
    }
  },
});

export default store;