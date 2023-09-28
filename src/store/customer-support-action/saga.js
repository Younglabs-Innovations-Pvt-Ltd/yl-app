import {all, call, put, takeLatest} from 'redux-saga/effects';

import {
  addInquiryFailed,
  addInquiryStart,
  addInquirySuccess,
  setMessage,
} from './reducer';
import {BASE_URL, ADD_INQUIRY_URL} from '@env';

// Add Inquiry
function* handleAddInquiry({
  payload: {courseId, comment, otherOption, bookingDetails},
}) {
  try {
    if (comment === 'Other' && !otherOption) {
      yield put(setMessage('Field is required.'));
      return;
    }

    const body = {
      fullName: bookingDetails?.parentName,
      phone: bookingDetails.phone,
      comment: otherOption ? otherOption : comment,
      courseId,
      source: 'app',
    };

    const response = yield fetch(`${BASE_URL}${ADD_INQUIRY_URL}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(yield response.json());

    if (response.ok) {
      yield put(addInquirySuccess());
    }
  } catch (error) {
    console.log('ADD_INQUIRY_ERROR_CUSTOMER_SUPPORT_ACTION= ', error);
  }
}

// Listeners
function* listenAddInquiry() {
  yield takeLatest(addInquiryStart.type, handleAddInquiry);
}

// Main saga
export function* csaSagas() {
  yield all([call(listenAddInquiry)]);
}
