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
  isRated: false,
  ratingLoading: true,
  nmiLoading: false,
  isNmi: false,
  isClassOngoing: false,
  demoFlag: false,
  message: '',
  joinClassLoading: false,
  joinClassErrorMsg: '',
  attendanceLoading: false,
  notInterestedPopup: false,
  appRemark: null,
};

// reducer
const reducer = {
  startFetchBookingDetailsFromPhone(state) {
    state.loading = true;
  },
  startFetchBookingDetailsFromId(state, action) {
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
  setBookingDetailsFailed(state, action) {
    state.loading = false;
    state.message = action.payload;
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
  },
  setTeamUrl(state, action) {
    state.teamUrl = action.payload;
  },
  setIsAttended(state, action) {
    state.attendanceLoading = false;
    state.isAttended = action.payload;
  },
  startMarkAttendace(state) {
    state.attendanceLoading = true;
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
    state.isNmi = true;
  },
  setNMI(state, action) {
    state.isNmi = action.payload;
  },
  setErrorMessage(state, action) {
    state.message = action.payload;
    state.nmiLoading = false;
  },
  setClassOngoing(state, action) {
    state.isClassOngoing = action.payload;
  },
  setDemoFlag(state, action) {
    state.demoFlag = action.payload;
  },
  joinFreeClass(state) {
    state.joinClassLoading = true;
  },
  setJoinClassLoading(state, action) {
    state.joinClassLoading = action.payload;
  },
  setJoinClassErrorMsg(state, action) {
    state.joinClassErrorMsg = action.payload;
  },
  setNotInterestedPopup(state, action) {
    state.notInterestedPopup = action.payload;
  },
  setAppRemark(state, action) {
    state.appRemark = action.payload;
  },
  setPhoneAsync() {},
  setDemoData() {
    console.log('in reducer');
  },
  setDemoNotifications() {},
  saveRating() {},
  checkForRating() {},
  joinDemo() {},
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
  joinDemo,
  setNMI,
  setClassOngoing,
  setDemoFlag,
  setBookingDetailsFailed,
  setJoinClassLoading,
  setJoinClassErrorMsg,
  startMarkAttendace,
  setNotInterestedPopup,
  setAppRemark,
} = demoSlice.actions;

export const joinDemoReducer = demoSlice.reducer;
