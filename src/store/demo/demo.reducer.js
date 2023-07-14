import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  demoData: null,
  demoBookingId: '',
  demoPhoneNumber: '',
  loading: false,
};

export const demoSlice = createSlice({
  name: 'demo',
  initialState: INITIAL_STATE,
});

export const demoReducer = demoSlice.reducer;
