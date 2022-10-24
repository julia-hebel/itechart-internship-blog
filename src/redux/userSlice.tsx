import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
const Cookies = require('js-cookie')

export const USERS_URL = 'http://localhost:5000/users';

const initialState = {
  currentUser: {},
  isLoggedIn: false,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
} as any;

export const getUserById = createAsyncThunk('user/getUserById', async () => {
  try {
    const response = await axios.get(USERS_URL);
    return response.data;
  } catch (error: any) {
    return error.message;
  }
});

export const addNewUser = createAsyncThunk(
  'user/addNewUser',
  async (newUser: any) => {
    try {
      const response = await axios.post(USERS_URL, newUser);
      return response.data;
    } catch (error: any) {
      return error.message;
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoggedIn = true;
        Cookies.set('currentUser', action.payload.id);
      })
  },
});

const userReducer = userSlice.reducer;
export default userReducer;
