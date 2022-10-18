import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const POSTS_URL = 'http://localhost:5000/posts';

const initialState = {
  posts: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (error: any) {
    return error.message;
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const loadedPosts = action.payload.map((post: any) => {
          return post;
        });
        state.posts = state.posts.concat(loadedPosts);
      });
  },
});

const postsReducer = postsSlice.reducer;
export default postsReducer;
