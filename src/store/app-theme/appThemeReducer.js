import {createSlice} from '@reduxjs/toolkit';

const lightThemeTextColors = {
  textPrimary: '#45454E',
  textSecondary: '#8C8C9C',
  textYlMain: '#76C8F2',
  textYlBlue: '#76C8F2',
  textYlGreen: '#55D400',
  textYlOrange: '#FFA600',
  textYlRed: '#F74300',
};
const darkThemeTextColors = {
  textPrimary: '#fff',
  textSecondary: '#fff',
  textYlMain: '#76C8F2',
  textYlBlue: '#76C8F2',
  textYlGreen: '#55D400',
  textYlOrange: '#FFA600',
  textYlRed: '#F74300',
};

const INITIAL_STATE = {
  darkMode: false,
  bgColor: '#fff',
  textColors: lightThemeTextColors,
  bgSecondaryColor: '#76C8F2',
  colorYlMain: '#76C8F2',
  addMoreCourseCardbgColor: '#d8d5d5',
};

const reducer = {
  setDarkMode(state, action) {
    state.darkMode = action.payload;
    if (action.payload) {
      state.bgColor = '#0C0C15';
      state.addMoreCourseCardbgColor = '#b6b6bc4f';
      state.textColors = darkThemeTextColors;
      state.bgSecondaryColor = '#b6b6bc4f';
    } else {
      state.bgColor = '#fff';
      state.addMoreCourseCardbgColor = '#d8d5d5';
      state.textColors = lightThemeTextColors;
      state.bgSecondaryColor = '#76C8F2';
    }
  },
};

const appThemeSlice = createSlice({
  name: 'appTheme',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

export const {setDarkMode} = appThemeSlice.actions;

export const appThemeReducer = appThemeSlice.reducer;
