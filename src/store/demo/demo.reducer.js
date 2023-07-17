import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  demoData: null,
  demoBookingId: '',
  demoPhoneNumber: '',
  loading: false,
};

// reducer
const reducer = {
  startFetchBookingDetailsFromPhone(state) {
    state.loading = true;
    // state.demoPhoneNumber = action.payload;
  },
  startFetchBookingDetailsFromId(state) {
    state.loading = true;
    // state.demoBookingId = action.payload;
  },
  setBookingDetailSuccess(state, action) {
    state.demoData = action.payload;
    state.loading = false;
  },
  setDemoPhone(state, action) {
    state.demoPhoneNumber = action.payload;
  },
  setDemoBookingId(state, action) {
    state.demoBookingId = action.payload;
  },
  setDemoData(state, action) {
    state.demoData = action.payload;
  },
};

// slice
export const demoSlice = createSlice({
  name: 'demo',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

// actions
export const {
  setBookingDetailSuccess,
  startFetchBookingDetailsFromPhone,
  startFetchBookingDetailsFromId,
  setDemoPhone,
  setDemoBookingId,
  setDemoData,
} = demoSlice.actions;

export const demoReducer = demoSlice.reducer;
