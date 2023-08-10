import {all, call} from 'redux-saga/effects';

import {joinDemoSaga} from './join-demo/join-demo.saga';
import {bookDemoSaga} from './book-demo/book-demo.saga';

export function* rootSaga() {
  yield all([call(joinDemoSaga), call(bookDemoSaga)]);
}