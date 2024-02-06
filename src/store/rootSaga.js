import {all, call} from 'redux-saga/effects';

import {joinDemoSaga} from './join-demo/join-demo.saga';
import {bookDemoSaga} from './book-demo/book-demo.saga';
import {welcomeScreenSagas} from './welcome-screen/saga';
import {csaSagas} from './customer-support-action/saga';
import {authSaga} from './auth/saga';
import {courseSagas} from './course/course.saga';
import {paymentSaga} from './payment/saga';
import {contentSaga} from './content/saga';
import { userSaga } from './user/saga';

export function* rootSaga() {
  yield all([
    call(joinDemoSaga),
    call(bookDemoSaga),
    call(welcomeScreenSagas),
    call(csaSagas),
    call(authSaga),
    call(courseSagas),
    call(paymentSaga),
    call(contentSaga),
    call(userSaga)
  ]);
}
