import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  formVisible: false,
  loading: false,
  message: '',
  success: false,
  courseId: '',
  comment: '',
  otherOption: '',
};

const reducer = {
  setFormVisible(state, action) {
    state.formVisible = action.payload;
  },
  setOtherOption(state, action) {
    state.otherOption = action.payload;
  },
  setComment(state, action) {
    state.comment = action.payload;
    state.message = '';
  },
  setCourseId(state, action) {
    state.courseId = action.payload;
  },
  resetState(state) {
    state.success = false;
    state.formVisible = false;
    state.comment = '';
    state.courseId = '';
    state.otherOption = '';
    state.message = '';
  },
  addInquiryStart(state) {
    state.loading = true;
  },
  addInquirySuccess(state) {
    state.loading = false;
    state.success = true;
  },
  setMessage(state, action) {
    state.message = action.payload;
    state.loading = false;
  },
  addInquiryFailed(state, action) {
    state.loading = false;
    state.message = action.payload;
  },
};

const csaSlice = createSlice({
  name: 'csa',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

export const csaReducer = csaSlice.reducer;

export const {
  setMessage,
  setFormVisible,
  addInquiryStart,
  addInquiryFailed,
  addInquirySuccess,
  setOtherOption,
  setComment,
  setCourseId,
  resetState,
} = csaSlice.actions;
