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

import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';

function* handleBookingStatus({payload: {phone, country}}) {
  if (!phone) {
    yield put(setErrorMessage('Enter phone number'));
    return;
  }

  try {
    const isValidPhone = isValidNumber(phone, country.countryCode.cca2);

    if (!isValidPhone) {
      yield put(setErrorMessage('Please enter a valid number'));
      return;
    }

    const response = yield fetchBookingDetailsFromPhone(phone);

    if (response.status === 400) {
      // Booking not found
      navigate(SCREEN_NAMES.BOOK_DEMO_FORM, {phone, country});
      yield put(setErrorMessage(''));
      return;
    }

    if (response.status === 200) {
      yield AsyncStorage.setItem(LOCAL_KEYS.PHONE, phone);
      yield AsyncStorage.setItem(LOCAL_KEYS.CALLING_CODE, country.callingCode);
      yield put(fetchBookingStatusSuccess(''));
      replace(SCREEN_NAMES.MAIN);
    }
  } catch (error) {
    console.log('BOOKING_STATUS_WELCOME_SCREEN_ERROR_SAGA', error);
    yield put(fetchBookingStatusFailed('Something went wrong'));
  }
}

function* startBookingStatus() {
  yield takeLatest(fetchBookingStatusStart.type, handleBookingStatus);
}

export function* welcomeScreenSagas() {
  yield all([call(startBookingStatus)]);
}
