import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import postTypes from '../types/postTypes';
import stateTypes from '../types/stateTypes';

const POSTS_URL = 'http://localhost:5000/posts';

const initialState = {
  posts: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
} as any;

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (error: any) {
    return error.message;
  }
});

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (newPost: postTypes) => {
    try {
      const response = await axios.post(POSTS_URL, newPost);
      return response.data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const loadedPosts = action.payload.map((post: postTypes) => {
          return post;
        });
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(addNewPost.fulfilled, (state, action: PayloadAction<postTypes>) => {
        state.posts.push(action.payload);
      });
  },
});

export const getAllPosts = (state: stateTypes) => state.posts.posts;
export const getPostsStatus = (state: stateTypes) => state.posts.status;

const postsReducer = postsSlice.reducer;
export default postsReducer;
