import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  loading: false,
  country: {callingCode: ''},
  modalVisible: false,
  message: '',
  courses: [],
  coursesLoading: false,
  coursesLoadingFailed: false,
  selectedChild: {},
  allBookingsLoding: false,
  allBookingsLoadingFailed: false,
  userBookings: null,
  userOrders: {},
  userOrdersLoading: false,
  userOrderLoadingFailed: false,
  userOrderLoadingFailedReason: '',
  selectedUserOrder:{}
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

  getCoursesForWelcomeScreen(state, action) {
    // console.log('payload in reducer', action.payload);
    state.coursesLoading = true;
    state.coursesLoadingFailed = false;
  },

  getCoursesForWelcomeScreenFailed(state) {
    state.coursesLoading = false;
    state.coursesLoadingFailed = true;
  },

  getCoursesForWelcomeScreenSuccess(state, action) {
    state.courses = action.payload;
    state.coursesLoading = false;
  },

  // user all bookings ops
  startGetAllBookings(state, action) {
    console.log('payload in reducer 2', action.payload);
    state.allBookingsLoadingFailed = false;
    state.allBookingsLoading = true;
  },
  getAllBookingsSuccess(state, action) {
    state.userBookings = action.payload;
    state.selectedChild = action.payload[0] || {};
    state.allBookingsLoading = false;
  },
  setAllBookingsFetchingFailed(state) {
    state.allBookingsLoading = false;
    state.allBookingsLoadingFailed = true;
  },
  setSelectedChild(state, action) {
    state.selectedChild = action.payload;
  },
  // User order ops
  startFetchingUserOrders(state) {
    console.log("fethching user orders reducer")
    state.userOrdersLoading = true;
    state.userOrderLoadingFailed = false;
    state.userOrderLoadingFailedReason = '';
  },
  userOrderFetchingSuccess(state, action) {
    state.userOrdersLoading = false;
    state.userOrders = action.payload;
  },
  userOrdersLoadingFailed(state, action) {
    state.userOrderLoadingFailed = true;
    state.userOrdersLoading = false;
    state.userOrderLoadingFailedReason = action.payload;
  },
  setSelectedUserOrder(state,action){
    state.selectedUserOrder = action.payload;
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
  getCoursesForWelcomeScreenSuccess,
  startGetAllBookings,
  getAllBookingsSuccess,
  setAllBookingsFetchingFailed,
  setSelectedChild,
  startFetchingUserOrders,
  userOrderFetchingSuccess,
  userOrdersLoadingFailed,
  setSelectedUserOrder
} = slice.actions;

export const welcomeScreenReducer = slice.reducer;
