import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../redux/languageSlice';
import postsReducer from '../redux/postsSlice';
import userReducer from '../redux/userSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    language: languageReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
