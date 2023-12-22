import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  contentLoading: false,
  contentData: null,
};

const reducers = {
  fetchContentDataStart(state) {
    state.contentLoading = true;
  },
  setContentData(state, action) {
    state.contentData = action.payload;
    state.contentLoading = false;
  },
};

const contentSlice = createSlice({
  name: 'content',
  reducers: reducers,
  initialState: INITIAL_STATE,
});

export const {fetchContentDataStart, setContentData} = contentSlice.actions;

export const contentReducer = contentSlice.reducer;
