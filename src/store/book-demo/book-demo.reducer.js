import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  timezone: '',
  ipData: null,
  country: {callingCode: ''},
  bookingSlots: [],
  loading: false,
};

// reducer
const reducer = {
  setTimezone(state, action) {
    state.timezone = action.payload;
  },
  startFetchingIpData(state) {
    state.loading = true;
  },
  fetchIpDataSuccess(state, action) {
    state.loading = false;
    state.ipData = action.payload;
  },
  startFetchingBookingSlots(state) {
    state.loading = true;
  },
  fetchBookingSlotsSuccess(state, action) {
    state.loading = false;
    state.bookingSlots = action.payload;
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
} = bookDemoSlice.actions;

// reducer
export const bookDemoReducer = bookDemoSlice.reducer;
