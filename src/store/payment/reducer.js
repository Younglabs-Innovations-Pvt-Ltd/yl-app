import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  loading: false,
  message: '',
  payment: '',
  paymentMessage: '',
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
  setPaymentMessage(state, action) {
    state.paymentMessage = action.payload;
    state.payment = '';
  },
  makeSoloPayment(state, action) {
    state.loading = true;
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
  setPaymentMessage,
  makeSoloPayment,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;
