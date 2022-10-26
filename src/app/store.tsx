import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../redux/postsSlice';
import userReducer from '../redux/userSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;