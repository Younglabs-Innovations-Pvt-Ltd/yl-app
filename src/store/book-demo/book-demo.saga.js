import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  startFetchingIpData,
  fetchIpDataSuccess,
  startFetchingBookingSlots,
  fetchBookingSlotsSuccess,
} from './book-demo.reducer';

const GEO_LOCATION_API =
  'https://api.ipgeolocation.io/ipgeo?apiKey=db02b89808894a7a9ddef353d01805dd';

const GET_SLOTS_API =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/demobook/getDemoSlots';

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
