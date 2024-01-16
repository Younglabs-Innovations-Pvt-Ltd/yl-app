import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  loading: false,
  country: {callingCode: ''},
  modalVisible: false,
  message: '',
  courses:[],
  coursesLoading:false,
  coursesLoadingFailed:false,
};

const reducer = {
  setCountry(state, action) {
    state.country = action.payload;
  },
  setErrorMessage(state, action) {
    state.message = action.payload;
    state.loading = false;
  },
  setModalVisible(state, action) {
    state.modalVisible = action.payload;
  },
  fetchBookingStatusStart(state) {
    console.log("i am here")
    state.loading = true;
  },
  setLoading(state, action) {
    state.loading = action.payload;
  },
  fetchBookingStatusSuccess(state, action) {
    state.loading = false;
    state.message = action.payload;
  },

  fetchBookingStatusFailed(state, action) {
    state.loading = false;
    state.message = action.payload;
  },

  getCoursesForWelcomeScreen(state , action) {
    console.log("payload in reducer", action.payload);
    state.coursesLoading = true;
    state.coursesLoadingFailed = false;
  },

  getCoursesForWelcomeScreenFailed(state){
    state.coursesLoading = false;
    state.coursesLoadingFailed = true;
  },
  
  getCoursesForWelcomeScreenSuccess(state , action){
    state.courses = action.payload;
    state.coursesLoading = false;
  }

};

const slice = createSlice({
  name: 'welcome-screen',
  reducers: reducer,
  initialState: INITIAL_STATE,
});

export const {
  setCountry,
  setErrorMessage,
  setLoading,
  setModalVisible,
  setMoveToForm,
  setMoveToMainScreen,
  fetchBookingStatusStart,
  fetchBookingStatusFailed,
  fetchBookingStatusSuccess,
  getCoursesForWelcomeScreen,
  getCoursesForWelcomeScreenFailed,
  getCoursesForWelcomeScreenSuccess
} = slice.actions;

export const welcomeScreenReducer = slice.reducer;
