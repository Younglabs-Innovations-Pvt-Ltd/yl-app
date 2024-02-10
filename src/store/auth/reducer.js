import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  token: '',
  loading: false,
  verificationLoading: false,
  verificationErrorMessage: '',
  message: '',
  confirm: null,
  email: '',
  user: null,
  userFetchLoading: false,
  customer: 'no',
  childAge: 8,
  credits: 980,
  logoutLoading: false,
  userFetchFailed:false,
};

const reducers = {
  phoneAuthStart(state) {
    state.loading = true;
    state.message = '';
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
  verifyCode(state, action) {
    state.verificationLoading = true;
    state.verificationErrorMessage = '';
  },
  setAuthLoading(state, action) {
    state.loading = action.payload;
  },
  setVerificationLoading(state, action) {
    state.verificationLoading = action.payload;
  },
  setAuthToken(state, action) {
    state.token = action.payload;
    state.message = '';
    state.confirm = null;
  },
  setFailedVerification(state, action) {
    state.verificationLoading = false;
    state.verificationErrorMessage = action.payload;
  },
  setEmail(state, action) {
    state.email = action.payload;
  },
  fetchUser(state, action) {
    state.userFetchLoading = true
  },
  setUser(state, action) {
    state.userFetchLoading = false;
    state.user = action.payload;
  },
  setIsCustomer(state, action) {
    if (action.payload) {
      state.customer = 'yes';
    } else {
      state.customer = 'no';
    }
  },
  logout() {},
  fetchUserFormLoginDetails(){},
  setUserManually(state ,action){
    state.user = action.payload;
  }
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
  setFailedVerification,
  setEmail,
  fetchUser,
  setUser,
  logout,
  setIsCustomer,
  fetchUserFormLoginDetails,
  setUserManually
} = authSlice.actions;

export const authReducer = authSlice.reducer;
