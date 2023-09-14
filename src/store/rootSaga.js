import {all, call} from 'redux-saga/effects';

import {joinDemoSaga} from './join-demo/join-demo.saga';
import {bookDemoSaga} from './book-demo/book-demo.saga';
import {welcomeScreenSagas} from './welcome-screen/saga';

export function* rootSaga() {
  yield all([call(joinDemoSaga), call(bookDemoSaga), call(welcomeScreenSagas)]);
}
