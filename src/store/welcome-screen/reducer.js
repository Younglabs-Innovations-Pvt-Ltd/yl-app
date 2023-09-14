import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  loading: false,
  country: {callingCode: ''},
  modalVisible: false,
  message: '',
};

const reducer = {
  setCountry(state, action) {
    state.country = action.payload;
  },
  setErrorMessage(state, action) {
    state.message = action.payload;
    state.loading = false;
  },
  setModalVisible(state, action) {
    state.modalVisible = action.payload;
  },
  fetchBookingStatusStart(state) {
    state.loading = true;
  },

  fetchBookingStatusSuccess(state, action) {
    state.loading = false;
    state.message = action.payload;
  },

  fetchBookingStatusFailed(state, action) {
    state.loading = false;
    state.message = action.payload;
  },
};

const slice = createSlice({
  name: 'welcome-screen',
  reducers: reducer,
  initialState: INITIAL_STATE,
});

export const {
  setCountry,
  setErrorMessage,
  setLoading,
  setModalVisible,
  setMoveToForm,
  setMoveToMainScreen,
  fetchBookingStatusStart,
  fetchBookingStatusFailed,
  fetchBookingStatusSuccess,
} = slice.actions;

export const welcomeScreenReducer = slice.reducer;
