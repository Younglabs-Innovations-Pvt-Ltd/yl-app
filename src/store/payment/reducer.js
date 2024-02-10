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
    state.message = '';
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
    state.message = '';
  },
  setMessage(state, action) {
    state.message = action.payload;
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
  setMessage,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;
