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
  },
  startFetchBookingDetailsFromId(state) {
    state.loading = true;
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
  setToInitialState(state) {
    state.demoData = null;
    state.demoBookingId = '';
    state.demoPhoneNumber = '';
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
  setDemoPhone,
  setDemoBookingId,
  setToInitialState,
} = demoSlice.actions;

export const joinDemoReducer = demoSlice.reducer;
