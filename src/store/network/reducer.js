import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
  networkState: {
    isConnected: true,
    alertAction: null,
  },
};

const reducer = {
  setCurrentNetworkState(state, action) {
    state.networkState.isConnected = false;
    state.networkState.alertAction = action.payload;
  },
  resetCurrentNetworkState(state) {
    state.networkState.isConnected = true;
    state.networkState.alertAction = null;
  },
};

const networkSlice = createSlice({
  name: 'network',
  initialState: INITIAL_STATE,
  reducers: reducer,
});

export const {setCurrentNetworkState, resetCurrentNetworkState} =
  networkSlice.actions;

export const networkReducer = networkSlice.reducer;
