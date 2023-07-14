import {all, call} from 'redux-saga/effects';

import {demoSaga} from './demo/demo.saga';

export function* rootSaga() {
  yield all([call(demoSaga)]);
}
