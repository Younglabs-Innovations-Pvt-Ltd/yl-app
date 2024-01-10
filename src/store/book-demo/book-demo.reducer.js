import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  timezone: '',
  ipData: null,
  country: {callingCode: ''},
  bookingSlots: [],
  errorMessage: '',
  popup: false,
  isBookingLimitExceeded: false,
  loading: {
    ipDataLoading: false,
    bookingSlotsLoading: false,
    bookingLoading: false,
  },
  selectedSlot:null,
  childData:null,
  bookingCreatedSuccessfully: false,
};

// reducer
const reducer = {
  setTimezone(state, action) {
    state.timezone = action.payload;
  },
  startFetchingIpData(state) {
    state.loading.ipDataLoading = true;
  },
  fetchIpDataSuccess(state, action) {
    state.loading.ipDataLoading = false;
    state.ipData = action.payload;
  },
  startFetchingBookingSlots(state) {
    state.loading.bookingSlotsLoading = true;
  },
  fetchBookingSlotsSuccess(state, action) {
    state.loading.bookingSlotsLoading = false;
    state.bookingSlots = action.payload;
  },
  setIpDataLoadingState(state, action) {
    state.ipDataLoading = action.payload;
  },
  setNewBookingStart(state , action) {
    // console.log("in reducer", action.payload)
    state.loading.bookingLoading = true;
  },
  setNewBookingSuccess(state) {
    state.loading.bookingLoading = false;
    state.isBookingLimitExceeded = false;
    state.popup = true;
  },
  setNewBookingFailed(state, payload) {
    state.loading.bookingLoading = false;
    state.errorMessage = payload;
  },
  setIsBookingLimitExceeded(state, action) {
    state.isBookingLimitExceeded = action.payload;
    state.loading.bookingLoading = false;
  },
  closePopup(state, action) {
    state.popup = action.payload;
  },
  stopLoading(state) {
    state.loading.ipDataLoading = false;
    state.loading.bookingSlotsLoading = false;
    state.bookingLoading = false;
  },
  setSelectedSlot(state , action){
    state.selectedSlot = action.payload;
  },
  setChildData(state , action){
    state.childData = action.payload;
  },
  changebookingCreatedSuccessfully(state, action){
    state.bookingCreatedSuccessfully = action.payload;
  }
};

// slice
const bookDemoSlice = createSlice({
  name: 'bookdemo',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

// actions
export const {
  setTimezone,
  startFetchingIpData,
  fetchIpDataSuccess,
  startFetchingBookingSlots,
  fetchBookingSlotsSuccess,
  setIpDataLoadingState,
  setNewBookingStart,
  setNewBookingFailed,
  setNewBookingSuccess,
  setIsBookingLimitExceeded,
  closePopup,
  stopLoading,
  setSelectedSlot,
  setChildData,
  changebookingCreatedSuccessfully
} = bookDemoSlice.actions;

// reducer
export const bookDemoReducer = bookDemoSlice.reducer;
