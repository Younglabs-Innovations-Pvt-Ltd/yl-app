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
  changebookingCreatedSuccessfully,
  setNewOneToOneBookingStart,
  setOneToOneBookingSuccess,
  setOneToOneBookingFailed,
} from './book-demo.reducer';

import {GEO_LOCATION_API, BASE_URL, GET_SLOTS_API} from '@env';
import {makeNewBooking, addNewSoloBooking} from '../../utils/api/yl.api';
import {fetchUserFormLoginDetails} from '../auth/reducer';
import Snackbar from 'react-native-snackbar';

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
  console.log('Fetch booking slots', payload);
  try {
    const response = yield fetch(`${BASE_URL}${GET_SLOTS_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('response is', response.status);
    const slotsData = yield response.json();
    console.log('data is', slotsData);
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
    console.log('Making Booking', data);
    const response = yield makeNewBooking(data);

    const bookingDetails = yield response.json();

    console.log(bookingDetails);

    if (response.status === 200) {
      yield put(setNewBookingSuccess());
      yield put(changebookingCreatedSuccessfully(true));
      Snackbar.show({
        text: 'Booking Created Successfully.',
        textColor: 'white',
        duration: Snackbar.LENGTH_LONG,
      });
      yield put(fetchUserFormLoginDetails());
    } else if (response.status === 400) {
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

// Handle OneToOne Booking
function* handleNewOneToOneBooking({payload}) {
  try {
    console.log('in a function');
    console.log('payload is', payload);
    const response = yield addNewSoloBooking(payload);

    if (response.status == 200) {
      yield put(setOneToOneBookingSuccess());
      yield put(fetchUserFormLoginDetails());
      Snackbar.show({
        text: 'Booking Created Successfully.',
        textColor: 'white',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  } catch (error) {
    console.log('eror', error.message);
    yield put(setOneToOneBookingFailed('Somethis went wrong'));
  }
}

function* startHandleOneToOneBooking() {
  yield takeLatest(setNewOneToOneBookingStart.type, handleNewOneToOneBooking);
}
// main saga
export function* bookDemoSaga() {
  yield all([
    call(startFetchIpData),
    call(startFetchingSlots),
    call(startHandleNewBooking),
    call(startHandleOneToOneBooking),
  ]);
}
