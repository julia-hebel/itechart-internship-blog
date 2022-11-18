import { createSlice } from '@reduxjs/toolkit';
import stateTypes from '../types/stateTypes';
const Cookies = require('js-cookie');

const initialState = {
  language: 'English',
  status: 'idle', // idle | loading | succeeded | failed
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      Cookies.set('language', action.payload, {
        expires: 365,
        sameSite: 'strict',
      });
    },
    loadLanguageFromCookie: (state) => {
      const cookieLanguage = Cookies.get('language');
      if (cookieLanguage) {
        state.language = cookieLanguage;
      } else {
        const locale = navigator.language;

        let localLanguage = '';

        switch (locale) {
          case 'pl-PL':
            localLanguage = 'Polish';
            break;
          default:
            localLanguage = 'English';
            break;
        }

        state.language = localLanguage;
        Cookies.set('language', localLanguage, {
          expires: 365,
          sameSite: 'strict',
        });
      }
    },
  },
});

export const getLanguage = (state: stateTypes) => state.language.language;
export const getLanguageStatus = (state: stateTypes) => state.language.status;

export const { setLanguage, loadLanguageFromCookie } = languageSlice.actions;

const languageReducer = languageSlice.reducer;
export default languageReducer;
