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
  selectedSlot: null,
  childData: null,
  bookingCreatedSuccessfully: false,
  selectedOneToOneDemoTime: '',
  oneToOneBookingFailed: false,
  bookingFailReason: undefined,
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
    state.timezone = action.payload.time_zone.offset_with_dst;
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
  setNewBookingStart(state, action) {
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
  setSelectedSlot(state, action) {
    state.selectedSlot = action.payload;
  },
  setChildData(state, action) {
    state.childData = action.payload;
  },
  changebookingCreatedSuccessfully(state, action) {
    state.bookingCreatedSuccessfully = action.payload;
  },
  setSelectedOneToOneDemoTime(state, action) {
    if (action.payload !== null) {
      state.selectedOneToOneDemoTime = action.payload;
    } else {
      state.selectedOneToOneDemoTime = false;
    }
  },

  setNewOneToOneBookingStart(state, action) {
    state.oneToOneBookingFailed = false;
    state.loading.bookingLoading = true;
  },
  setOneToOneBookingSuccess(state, action) {
    state.loading.bookingLoading = false;
    state.bookingCreatedSuccessfully = true;
  },
  setOneToOneBookingFailed(state, action) {
    state.oneToOneBookingFailed = true;
    state.loading.bookingLoading = false;
    state.bookingCreatedSuccessfully = false;
    state.bookingFailReason = action.payload;
  },
  setOneToOneBookingFailed2(state, action) {
    state.oneToOneBookingFailed = action.payload;
    state.bookingFailReason = '';
  },
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
  changebookingCreatedSuccessfully,
  setSelectedOneToOneDemoTime,
  setNewOneToOneBookingStart,
  setOneToOneBookingSuccess,
  setOneToOneBookingFailed,
  setOneToOneBookingFailed2,
} = bookDemoSlice.actions;

// reducer
export const bookDemoReducer = bookDemoSlice.reducer;
