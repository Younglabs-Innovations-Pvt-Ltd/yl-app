import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  demoData: null,
  demoBookingId: '',
  demoPhoneNumber: '',
  loading: false,
};

// reducer
const reducer = {
  startFetchBookingDetailsFromPhone(state, action) {
    state.loading = true;
    // state.demoPhoneNumber = action.payload;
  },
  startFetchBookingDetailsFromId(state, action) {
    state.loading = true;
    // state.demoBookingId = action.payload;
  },
  setBookingDetailSuccess(state, action) {
    state.demoData = action.payload;
    state.loading = false;
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
} = demoSlice.actions;

export const demoReducer = demoSlice.reducer;
