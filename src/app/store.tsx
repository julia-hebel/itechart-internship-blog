import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../redux/postsSlice';
import userReducer from '../redux/userSlice';

export default configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
  },
});
