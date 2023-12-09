import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  courseDetails: null,
  ageGroups: [],
  courseId: null,
  batches: [],
  prices: [],
  loading: false,
  message: '',
  price: 0,
  strikeThroughPrice: 0,
  levelText: '',
  currentSelectedBatch: null,
  currentAgeGroup: '',
  currentLevel: 1,
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
  setPrice(state, action) {
    state.price = action.payload;
  },
  setStrikeThroughPrice(state, action) {
    state.strikeThroughPrice = action.payload;
  },
  setLoading(state, action) {
    state.loading = action.payload;
  },
  setLevelText(state, action) {
    state.levelText = action.payload;
  },
  setCurrentSelectedBatch(state, action) {
    state.currentSelectedBatch = action.payload;
  },
  setCurrentAgeGroup(state, action) {
    state.currentAgeGroup = action.payload;
  },
  setCurrentLevel(state, action) {
    state.currentLevel = action.payload;
  },
  resetCourseDetails(state) {
    state.currentAgeGroup = '';
    state.currentSelectedBatch = null;
    state.currentLevel = 1;
    state.levelText = '';
  },
};

const courseSlice = createSlice({
  name: 'course',
  reducers: reducer,
  initialState: INITIAL_STATE,
});

export const {
  fetchCourseFailed,
  fetchCourseStart,
  fetchCourseSuccess,
  setPrice,
  setStrikeThroughPrice,
  setLoading,
  setCurrentAgeGroup,
  setCurrentLevel,
  setCurrentSelectedBatch,
  setLevelText,
  resetCourseDetails,
} = courseSlice.actions;

export const courseReducer = courseSlice.reducer;
