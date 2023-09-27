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

import {GEO_LOCATION_API, BASE_URL, GET_SLOTS_API} from '@env';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeNewBooking} from '../../utils/api/yl.api';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';

/**
 * @author Shobhit
 * @since 20/09/2023
 * @description
 * Fetch ip data related to current location
 * Contains timezone, country code and calling code
 */
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

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param payload An object that contains courseId, childAge, timezone, type
 * @description Fetch booking slots calling from BookDemoSlots Screen
 */
function* fetchBookingSlots({payload}) {
  try {
    const response = yield fetch(`${BASE_URL}${GET_SLOTS_API}`, {
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

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param data booking related data
 * @param ipData Object that contains ip data
 * @description
 * Create new booking
 * Save calling code from ipData and phone to local storage
 */
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

/**
 * Listener functions that call when dispatch a related action
 */

// Fetch Ip data
function* startFetchIpData() {
  yield takeLatest(startFetchingIpData.type, fetchIpData);
}

// Fetch booking slots
function* startFetchingSlots() {
  yield takeLatest(startFetchingBookingSlots.type, fetchBookingSlots);
}

// Handle new booking
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
