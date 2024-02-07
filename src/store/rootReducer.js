import {combineReducers} from '@reduxjs/toolkit';

import {joinDemoReducer} from './join-demo/join-demo.reducer';
import {bookDemoReducer} from './book-demo/book-demo.reducer';
import {welcomeScreenReducer} from './welcome-screen/reducer';
import {csaReducer} from './customer-support-action/reducer';
import {networkReducer} from './network/reducer';
import {authReducer} from './auth/reducer';
import {courseReducer} from './course/course.reducer';
import {paymentReducer} from './payment/reducer';
import {uploadReducer} from './upload-handwriting/reducer';
import {contentReducer} from './content/reducer';
import {appThemeReducer} from './app-theme/appThemeReducer';
import {handleCourseReducer} from './handleCourse/reducer';
import {handleHomeWorkReducer} from './homework-submit/reducer';
import { handleRecordingRequestReducer } from './request-recording/reducer';

const reducer = combineReducers({
  joinDemo: joinDemoReducer,
  bookDemo: bookDemoReducer,
  welcome: welcomeScreenReducer,
  csa: csaReducer,
  networkState: networkReducer,
  auth: authReducer,
  course: courseReducer,
  payment: paymentReducer,
  upload: uploadReducer,
  content: contentReducer,
  appTheme: appThemeReducer,
  handleCourse: handleCourseReducer,
  submitHomeWork: handleHomeWorkReducer,
  requestRecording:handleRecordingRequestReducer
});

export const rootReducer = (state, action) => {
  // console.log('state', action.type);
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return reducer(state, action);
};
