import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  serviceReqClassesLoading: false,
  serviceReqClassesData: null,
  serviceReqClassesDataFailed: false,
};

// reducer
const reducer = {
  startFetchServiceRequestClasses(state) {
    state.serviceReqClassesLoading = true;
    state.serviceReqClassesDataFailed = false;
  },
  fetchServiceRequestClassesSuccess(state, action) {
    console.log('homework is updated');
    state.serviceReqClassesData = action.payload;
    state.serviceReqClassesLoading = false;
    state.serviceReqClassesDataFailed = false;
  },
  fetchServiceRequestClassesFailure(state, action) {
    state.serviceReqClassesLoading = false;
    state.serviceReqClassesDataFailed = true;
  },
};

// slice
export const handleCourseSlice = createSlice({
  name: 'handleCourse',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

// actions
export const {
  startFetchServiceRequestClasses,
  fetchServiceRequestClassesSuccess,
  fetchServiceRequestClassesFailure,
} = handleCourseSlice.actions;

export const handleCourseReducer = handleCourseSlice.reducer;
