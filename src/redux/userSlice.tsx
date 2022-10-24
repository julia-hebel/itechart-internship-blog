import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
const Cookies = require('js-cookie');

export const USERS_URL = 'http://localhost:5000/users';

const initialState = {
  currentUser: {},
  isLoggedIn: false,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
} as any;

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

export const loadUserFromCookie = createAsyncThunk(
  'user/loadUserFromCookie',
  async () => {
    try {
      const cookieUserId = Cookies.get('currentUser');
      if (cookieUserId) {
        const response = await axios.get(`${USERS_URL}/${cookieUserId}`);
        console.log('res data', response.data);
        return response.data;
      }
    } catch (error: any) {
      return error.message;
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log('payload', action.payload);
      state.currentUser = action.payload;
      state.isLoggedIn = true;
      Cookies.set('currentUser', action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoggedIn = true;
        Cookies.set('currentUser', action.payload.id);
      })
      .addCase(loadUserFromCookie.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(loadUserFromCookie.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentUser = action.payload;
          state.isLoggedIn = true;
        }
        state.status = 'succeeded';
      })
      .addCase(loadUserFromCookie.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { loginUser } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
