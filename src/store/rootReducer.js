import {combineReducers} from '@reduxjs/toolkit';

import {joinDemoReducer} from './join-demo/join-demo.reducer';
import {bookDemoReducer} from './book-demo/book-demo.reducer';
import {welcomeScreenReducer} from './welcome-screen/reducer';
import {csaReducer} from './customer-support-action/reducer';
import {networkReducer} from './network/reducer';

export const rootReducer = combineReducers({
  joinDemo: joinDemoReducer,
  bookDemo: bookDemoReducer,
  welcome: welcomeScreenReducer,
  csa: csaReducer,
  networkState: networkReducer,
});
