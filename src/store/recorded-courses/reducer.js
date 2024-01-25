import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  coursesLoading: false,
  courses: [],
  coursesLoadingFailed: false,
  coursesLoadingFailedMessage: '',
};

const reducer = {};

const recordedCoursesSlice = createSlice({
  name: 'recordedCourses',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

export const {setDarkMode} = appThemeSlice.actions;
export const appThemeReducer = recordedCoursesSlice.reducer;
