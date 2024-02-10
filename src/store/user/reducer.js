import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  currentChild:null,
  children:null,
  isFirstTimeUser:false,
  childAddLoading:false,
  childAddFailed:false,
  showChildAddSheet:false,
  bookingLoading:false,
  bookingLoadingFailed:false,
  bookingData:null
};

const reducers = {
  setCurrentChild(state ,action){
    state.currentChild = action.payload;
  },
  setChildren(state, action){
    state.children = action.payload;
  },
  setIsFirstTimeUser(state, action){
    state.isFirstTimeUser = action.payload;
  },
  startAddingChild(state){
    state.childAddLoading = true;
  },
  childAdded(state ,action){
    state.childAddLoading = false;
    state.childAddFailed = action.payload;
  },
  setChildAddSheet(state , action){
    state.showChildAddSheet = action.payload
  },
  startFetchBookingDetailsByName(state){
    state.bookingLoading = true;
  },
  fetchBookingDetailsSuccess(state ,action){
    state.bookingLoading = false;
    state.bookingData = action.payload;
  },
  fetchBookingDataFailed(state, action){
    state.bookingLoading = false
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: reducers,
});

export const {
  setCurrentChild,
  setChildren,
  setIsFirstTimeUser,
  startAddingChild,
  childAdded,
  setChildAddSheet,
  startFetchBookingDetailsByName,
  fetchBookingDetailsSuccess,
  fetchBookingDataFailed
} = userSlice.actions;

export const userReducer = userSlice.reducer;
