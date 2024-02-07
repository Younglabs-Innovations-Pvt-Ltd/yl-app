import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  ClasseRecordingRequestLoading: false,
  ClasseRecordingData: null,
  ClasseRecordingRequestFailed: false,
  requestRecordingSuccessfully: false,
};

// reducer
const reducer = {
  startRecordingRequest(state) {
    state.ClasseRecordingRequestLoading = true;
    state.ClasseRecordingRequestFailed = false;
  },
  ClasseRecordingRequestSuccess(state, action) {
    state.ClasseRecordingData = action.payload;
    state.ClasseRecordingRequestLoading = false;
    state.ClasseRecordingRequestFailed = false;
    state.requestRecordingSuccessfully = true;
  },
  ClasseRecordingRequestFailure(state, action) {
    state.ClasseRecordingRequestLoading = false;
    state.ClasseRecordingRequestFailed = true;
  },
  SetRecordingRequest(state, action) {
    state.requestRecordingSuccessfully = false;
  },
};

// slice
export const handleClassRecordingRequest = createSlice({
  name: 'requestRecording',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

// actions
export const {
  startRecordingRequest,
  ClasseRecordingRequestSuccess,
  ClasseRecordingRequestFailure,
  SetRecordingRequest,
} = handleClassRecordingRequest.actions;

export const handleRecordingRequestReducer =
  handleClassRecordingRequest.reducer;
