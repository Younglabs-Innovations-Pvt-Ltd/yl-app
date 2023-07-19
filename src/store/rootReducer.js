import {combineReducers} from '@reduxjs/toolkit';

import {joinDemoReducer} from './join-demo/join-demo.reducer';
import {bookDemoReducer} from './book-demo/book-demo.reducer';

export const rootReducer = combineReducers({
  joinDemo: joinDemoReducer,
  bookDemo: bookDemoReducer,
});
