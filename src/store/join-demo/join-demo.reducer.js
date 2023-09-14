import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  demoData: null,
  bookingDetails: null,
  demoBookingId: '',
  demoPhoneNumber: '',
  loading: false,
  teamUrl: null,
  showJoinButton: false,
  isAttended: false,
  bookingTime: null,
  isAttendenceMarked: false,
  message: '',
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
    const {
      payload: {demoData, bookingDetails},
    } = action;
    state.demoData = demoData;
    state.bookingDetails = bookingDetails;
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
    state.demoPhoneNumber = '';
    state.demoBookingId = '';
    state.teamUrl = null;
    state.showJoinButton = false;
    state.isAttended = false;
    state.bookingTime = null;
    state.isAttendenceMarked = false;
  },
  setIsAttendenceMarked(state, action) {
    state.isAttendenceMarked = action.payload;
  },
  setTeamUrl(state, action) {
    state.teamUrl = action.payload;
  },
  setShowJoinButton(state, action) {
    state.showJoinButton = action.payload;
  },
  setIsAttended(state, action) {
    state.isAttended = action.payload;
  },
  setBookingTime(state, action) {
    state.bookingTime = action.payload;
  },
  setErrorMessage(state, action) {
    state.message = action.payload;
  },
  setPhoneAsync() {},
  setDemoData() {},
  setDemoNotifications() {},
  joinFreeClass() {},
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
  setPhoneAsync,
  setDemoData,
  setBookingTime,
  setIsAttended,
  setIsAttendenceMarked,
  setShowJoinButton,
  setTeamUrl,
  setDemoNotifications,
  joinFreeClass,
  setErrorMessage,
} = demoSlice.actions;

export const joinDemoReducer = demoSlice.reducer;
