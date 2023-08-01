import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  startFetchingIpData,
  fetchIpDataSuccess,
  startFetchingBookingSlots,
  fetchBookingSlotsSuccess,
} from './book-demo.reducer';

import {GEO_LOCATION_API, GET_SLOTS_API} from '@env';

// Fetch ip address data
function* fetchIpData() {
  try {
    const response = yield fetch(GEO_LOCATION_API, {
      method: 'GET',
    });

    const data = yield response.json();
    yield put(fetchIpDataSuccess(data));
  } catch (error) {
    console.log('Timezone error', error);
  }
}

// fetch booking slots
function* fetchBookingSlots({payload}) {
  try {
    const response = yield fetch(GET_SLOTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const slotsData = yield response.json();
    yield put(fetchBookingSlotsSuccess(slotsData));
  } catch (error) {
    console.log('Slots error', error);
  }
}

// start functions
function* startFetchIpData() {
  yield takeLatest(startFetchingIpData.type, fetchIpData);
}

function* startFetchingSlots() {
  yield takeLatest(startFetchingBookingSlots.type, fetchBookingSlots);
}

export function* bookDemoSaga() {
  yield all([call(startFetchIpData), call(startFetchingSlots)]);
}
