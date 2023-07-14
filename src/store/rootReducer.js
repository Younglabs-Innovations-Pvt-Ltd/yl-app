import {combineReducers} from '@reduxjs/toolkit';

import {demoReducer} from './demo/demo.reducer';

export const rootReducer = combineReducers({
  demo: demoReducer,
});
