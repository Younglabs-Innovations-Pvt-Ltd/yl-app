import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchBookingStatusStart,
  fetchBookingStatusFailed,
  fetchBookingStatusSuccess,
  setErrorMessage,
} from './reducer';

import {fetchBookingDetailsFromPhone} from '../../utils/api/yl.api';
import {isValidNumber} from '../../utils/isValidNumber';

import {navigate, replace} from '../../navigationRef';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';

import {
  setCountryCallingCodeAsync,
  setLocalPhoneAsync,
} from '../../utils/storage/storage-provider';

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param phone Phone number of user
 * @param country Object of country code and calling code
 * @description
 * Check for a booking against phone number
 * If booking then redirect to home screen
 * If not redirect to create new booking screen
 */
function* handleBookingStatus({payload: {phone, country}}) {
  if (!phone) {
    yield put(setErrorMessage('Enter phone number'));
    return;
  }

  try {
    // Check for length of a phone number according to country
    // Return true or false
    const isValidPhone = isValidNumber(phone, country.countryCode.cca2);

    if (!isValidPhone) {
      yield put(setErrorMessage('Please enter a valid number'));
      return;
    }

    // Get booking data
    const response = yield fetchBookingDetailsFromPhone(phone);

    if (response.status === 400) {
      // Booking not found
      navigate(SCREEN_NAMES.BOOK_DEMO_FORM, {phone, country}); //Redirect to BookDemoForm Screen
      yield put(setErrorMessage(''));
      return;
    }

    if (response.status === 200) {
      yield setLocalPhoneAsync(phone);
      yield setCountryCallingCodeAsync(country.callingCode);
      yield put(fetchBookingStatusSuccess(''));
      replace(SCREEN_NAMES.MAIN); // Redirect to main screen
    }
  } catch (error) {
    console.log('BOOKING_STATUS_WELCOME_SCREEN_ERROR_SAGA', error);
    yield put(fetchBookingStatusFailed('Something went wrong'));
  }
}

/**
 * Listener functions that call when dispatch a related action
 */

// Set booking status
function* startBookingStatus() {
  yield takeLatest(fetchBookingStatusStart.type, handleBookingStatus);
}

// Main saga
export function* welcomeScreenSagas() {
  yield all([call(startBookingStatus)]);
}
