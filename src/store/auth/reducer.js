import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  token: '',
  loading: false,
  verificationLoading: false,
  verificationErrorMessage: '',
  message: '',
  confirm: null,
  email: '',
  // user: null,
  user: {
    leadId: 100058,
    credits: 960,
    phone: 7982726046,
    token:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdjZjdmODcyNzA5MWU0Yzc3YWE5OTVkYjYwNzQzYjdkZDJiYjcwYjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20veW91bmdsYWJzLXVhdCIsImF1ZCI6InlvdW5nbGFicy11YXQiLCJhdXRoX3RpbWUiOjE3MDUzOTQwMzIsInVzZXJfaWQiOiJwVFBhcEV0R0RsVHVJZmtIbkFpOWtZTmJRMGsyIiwic3ViIjoicFRQYXBFdEdEbFR1SWZrSG5BaTlrWU5iUTBrMiIsImlhdCI6MTcwNTc0NTUyNSwiZXhwIjoxNzA1NzQ5MTI1LCJlbWFpbCI6InNlZW5hYmFidTM2NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsic2VlbmFiYWJ1MzY1QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.iV3mnMJg1_awQzkzbRBBXG0pGf80bL1gqxGdaLOjKGcdTRa1b8Z6Hb7bD_S64EZWqyzXtZtpbUQTgJrCiM4v584ay2SJBNZcT60UIxHSC5aP9HP9f_7EbccchlCYTbgD2kh1sqtV-h5HFrDfz_PD_N4yZQQj853q1ObMyMSf8R1nGdoUtQjvVPzquXXxWbkFAfteiOupZYVVixopIBY86yzXVZYU9DHDOGcyYN0_F4MIHVNHjFyhyaVBygo45LIBg-Rk63MlTYMq_q-oQ67pc9m6694JXixNUgTDkoGPSCOr9iPPoFkpcz1J_8bzwKJXD5QMLEl4mNOhbGaucmkS_g',
  },
  customer: 'no',
  childName: 'Rahul Singh',
  childAge: 8,
  credits: 980,
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
  fetchUser(state, action) {},
  setUser(state, action) {
    state.user = action.payload;
  },
  logout() {},
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
} = authSlice.actions;

export const authReducer = authSlice.reducer;
