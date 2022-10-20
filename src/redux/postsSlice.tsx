import { createSlice, createAsyncThunk, nanoid, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
  async (newPost: any) => {
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
      .addCase(getPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const loadedPosts = action.payload.map((post: any) => {
          return post;
        });
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(addNewPost.fulfilled, (state, action: PayloadAction<any>) => {
        // console.log('payload', action.payload)
        state.posts.push(action.payload);
      });
  },
});

const postsReducer = postsSlice.reducer;
export default postsReducer;
