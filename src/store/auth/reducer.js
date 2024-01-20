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
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdjZjdmODcyNzA5MWU0Yzc3YWE5OTVkYjYwNzQzYjdkZDJiYjcwYjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20veW91bmdsYWJzLXVhdCIsImF1ZCI6InlvdW5nbGFicy11YXQiLCJhdXRoX3RpbWUiOjE3MDUzOTQwMzIsInVzZXJfaWQiOiJwVFBhcEV0R0RsVHVJZmtIbkFpOWtZTmJRMGsyIiwic3ViIjoicFRQYXBFdEdEbFR1SWZrSG5BaTlrWU5iUTBrMiIsImlhdCI6MTcwNTczMTIyNCwiZXhwIjoxNzA1NzM0ODI0LCJlbWFpbCI6InNlZW5hYmFidTM2NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsic2VlbmFiYWJ1MzY1QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.hwquU2UqqMnjsse6RIPc5Ssr7oqgbFV5Jnw4Mu1E-U5Q1nZZPHZnH95jZBbk8UIbWUo5mDnQTKLsF2J6-p1SKMfHPD-qXyEt3dNTm1tcLIKU7F1Y8szW612zmi7fuX_uNxZExe0xoINq5JdLoX0MNMI4chvbuHKTIV2REMTL5TtnKiLR1ErOIi0ALZUhIP3FJJz0b6SnTmfaodSnQa1BoC2thKO6NNmdJbf5-BEIbxk_96jlvdHNZErqVRocYbtkrAO24RUEZ8x-XStT0Z7trPMe6Kya1Ogab-ymdpHOVlHdKo6sidqkPHodnLMgXvQHOsTqh28AflnjQkD9TVJ4ng',
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
