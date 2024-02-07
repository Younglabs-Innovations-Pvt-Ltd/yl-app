import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  ClassesHomeWorkSubmitLoading: false,
  ClassesHomeWorkSubmitData: null,
  ClassesHomeWorkHomeWorkFailed: false,
  homeworksubmittedsuccessfully: false,
};

// reducer
const reducer = {
  startSubmittingClasseHomeWork(state) {
    state.ClassesHomeWorkSubmitLoading = true;
    state.ClassesHomeWorkHomeWorkFailed = false;
  },
  ClassesHomeWorkSubmitedSuccess(state, action) {
    console.log('check homeworksubmit');
    state.ClassesHomeWorkSubmitData = action.payload;
    state.ClassesHomeWorkSubmitLoading = false;
    state.ClassesHomeWorkHomeWorkFailed = false;
    state.homeworksubmittedsuccessfully = true;
  },
  ClassesHomeWorkSubmitFailure(state, action) {
    state.ClassesHomeWorkSubmitLoading = false;
    state.ClassesHomeWorkHomeWorkFailed = true;
  },
  SetHomeWorkSubmit(state, action) {
    state.homeworksubmittedsuccessfully = false;
  },
};

// slice
export const handleSubmitClassesHomeWork = createSlice({
  name: 'handleSubmitHomeWork',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

// actions
export const {
  startSubmittingClasseHomeWork,
  ClassesHomeWorkSubmitedSuccess,
  ClassesHomeWorkSubmitFailure,
  SetHomeWorkSubmit,
} = handleSubmitClassesHomeWork.actions;

export const handleHomeWorkReducer = handleSubmitClassesHomeWork.reducer;
