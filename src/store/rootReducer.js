import {combineReducers} from '@reduxjs/toolkit';

import {joinDemoReducer} from './join-demo/join-demo.reducer';

export const rootReducer = combineReducers({
  joinDemo: joinDemoReducer,
});
