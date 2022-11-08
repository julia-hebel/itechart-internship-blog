import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import stateTypes from '../types/stateTypes';
import userTypes from '../types/userTypes';
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
  async (newUser: userTypes) => {
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
    const cookieUserId = Cookies.get('currentUser');
    if (cookieUserId) {
      try {
        const response = await axios.get(`${USERS_URL}/${cookieUserId}`);
        return response.data;
      } catch (error: any) {
        Cookies.remove('currentUser');
        window.location.reload();
        return error.message;
      }
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (updatedUser: userTypes) => {
    try {
      const response = await axios.put(
        `${USERS_URL}/${updatedUser.id}`,
        updatedUser
      );
      return response.data;
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
      state.currentUser = action.payload;
      state.isLoggedIn = true;
      Cookies.set('currentUser', action.payload.id, {
        expires: 365,
        sameSite: 'strict',
      });
    },
    logoutUser: (state) => {
      state.currentUser = {};
      state.isLoggedIn = false;
      Cookies.remove('currentUser');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoggedIn = true;
        Cookies.set('currentUser', action.payload.id, {
          expires: 365,
          sameSite: 'strict',
        });
      })
      .addCase(loadUserFromCookie.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadUserFromCookie.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentUser = action.payload;
          state.isLoggedIn = true;
          if (action.payload.id) {
            Cookies.set('currentUser', action.payload.id, {
              expires: 365,
              sameSite: 'strict',
            });
          }
        }
        state.status = 'succeeded';
      })
      .addCase(loadUserFromCookie.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const getCurrentUser = (state: stateTypes) => state.user.currentUser;
export const getIsLoggedIn = (state: stateTypes) => state.user.isLoggedIn;
export const getUserStatus = (state: stateTypes) => state.user.status;

export const { loginUser, logoutUser } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
