import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  selectedImage: null,
  modalVisible: false,
};

const reducers = {
  setSelectedImage(state, action) {
    state.selectedImage = action.payload.image;
    state.modalVisible = action.payload.modal;
  },
};

const uploadSlice = createSlice({
  name: 'upload',
  reducers: reducers,
  initialState: INITIAL_STATE,
});

export const {setSelectedImage} = uploadSlice.actions;

export const uploadReducer = uploadSlice.reducer;
