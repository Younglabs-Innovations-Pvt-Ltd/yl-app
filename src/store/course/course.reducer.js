import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  courseDetails: null,
  ageGroups: [],
  courseId: null,
  batches: [],
  prices: [],
  loading: false,
  message: '',
};

const reducer = {
  fetchCourseStart(state) {
    state.loading = true;
  },
  fetchCourseSuccess(state, action) {
    state.courseDetails = action.payload.courseDetails;
    state.ageGroups = action.payload.ageGroups;
    state.courseId = action.payload.courseId;
    state.batches = action.payload.batches;
    state.prices = action.payload.prices;
    state.loading = false;
    state.message = '';
  },
  fetchCourseFailed(state, action) {
    state.message = action.payload.message;
  },
};

const courseSlice = createSlice({
  name: 'course',
  reducers: reducer,
  initialState: INITIAL_STATE,
});

export const {fetchCourseFailed, fetchCourseStart, fetchCourseSuccess} =
  courseSlice.actions;

export const courseReducer = courseSlice.reducer;
