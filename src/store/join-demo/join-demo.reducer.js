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
  isRated: false,
  ratingLoading: true,
  nmiLoading: false,
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
  setLoading(state, action) {
    state.loading = action.payload;
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
  setIsRated(state, action) {
    state.isRated = action.payload;
  },
  setRatingLoading(state, action) {
    state.ratingLoading = action.payload;
  },
  setBookingTime(state, action) {
    state.bookingTime = action.payload;
  },
  markNMI(state) {
    state.nmiLoading = true;
  },
  markNMISuccess(state) {
    state.nmiLoading = false;
  },
  setErrorMessage(state, action) {
    state.message = action.payload;
    state.nmiLoading = false;
  },
  setPhoneAsync() {},
  setDemoData() {},
  setDemoNotifications() {},
  joinFreeClass() {},
  saveRating() {},
  checkForRating() {},
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
  setIsRated,
  saveRating,
  checkForRating,
  setRatingLoading,
  markNMI,
  setIsRedirectToWhatsApp,
  markNMISuccess,
  setLoading,
} = demoSlice.actions;

export const joinDemoReducer = demoSlice.reducer;
