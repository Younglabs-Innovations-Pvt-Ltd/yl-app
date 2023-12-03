import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  token: '',
  loading: false,
  verificationLoading: false,
  message: '',
  confirm: null,
};

const reducers = {
  phoneAuthStart(state) {
    state.loading = true;
  },
  phoneAuthSuccess(state, action) {
    state.loading = false;
    state.token = action.payload;
    state.message = '';
  },
  phoneAuthFailed(state, action) {
    state.loading = false;
    state.message = action.payload;
  },
  setConfirm(state, action) {
    state.loading = false;
    state.confirm = action.payload;
  },
  verifyCode() {
    state.verificationLoading = true;
    state.message = '';
  },
  setAuthLoading(state, action) {
    state.loading = action.payload;
  },
  setVerificationLoading(state, action) {
    state.verificationLoading = action.payload;
  },
  setAuthToken(state, action) {
    state.token = action.payload;
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: reducers,
});

export const {
  phoneAuthFailed,
  phoneAuthStart,
  phoneAuthSuccess,
  setConfirm,
  verifyCode,
  setAuthLoading,
  setVerificationLoading,
  setAuthToken,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
