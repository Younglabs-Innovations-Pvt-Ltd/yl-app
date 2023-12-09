import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  loading: false,
  message: '',
  payment: '',
};

const reducers = {
  setLoading(state, action) {
    state.loading = action.payload;
  },
  startMakePayment(state) {
    state.loading = true;
  },
  makePaymentSuccess(state, action) {
    state.loading = false;
    state.payment = action.payload;
  },
  makePaymentFailed(state, action) {
    state.loading = false;
    state.message = action.payload;
  },
  setPayment(state, action) {
    state.payment = action.payload;
  },
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState: INITIAL_STATE,
  reducers,
});

export const {
  startMakePayment,
  makePaymentFailed,
  makePaymentSuccess,
  setLoading,
  setPayment,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;
