import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  startFetchingIpData,
  fetchIpDataSuccess,
  startFetchingBookingSlots,
  fetchBookingSlotsSuccess,
  setNewBookingStart,
  setNewBookingFailed,
  setNewBookingSuccess,
  setIsBookingLimitExceeded,
} from './book-demo.reducer';

import {GEO_LOCATION_API, GET_SLOTS_API, ADD_BOOKINGS_API} from '@env';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeNewBooking} from '../../utils/api/yl.api';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';

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

function* handleNewBooking({payload: {data, ipData}}) {
  try {
    const response = yield makeNewBooking(data);

    const bookingDetails = yield response.json();

    if (response.status === 200) {
      yield AsyncStorage.setItem(LOCAL_KEYS.PHONE, data.phone.toString());
      yield AsyncStorage.setItem(LOCAL_KEYS.CALLING_CODE, ipData.calling_code);

      yield put(setNewBookingSuccess());
    } else if (response.status === 400) {
      console.log('booking data', bookingDetails);
      yield put(setIsBookingLimitExceeded(true));
    }
  } catch (error) {
    console.log('booking error', error);
    setNewBookingFailed('Booking failed');
  }
}

// start functions
function* startFetchIpData() {
  yield takeLatest(startFetchingIpData.type, fetchIpData);
}

function* startFetchingSlots() {
  yield takeLatest(startFetchingBookingSlots.type, fetchBookingSlots);
}

function* startHandleNewBooking() {
  yield takeLatest(setNewBookingStart.type, handleNewBooking);
}
// main saga
export function* bookDemoSaga() {
  yield all([
    call(startFetchIpData),
    call(startFetchingSlots),
    call(startHandleNewBooking),
  ]);
}
