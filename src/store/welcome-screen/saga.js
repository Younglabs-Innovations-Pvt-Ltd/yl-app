import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchBookingStatusStart,
  fetchBookingStatusFailed,
  fetchBookingStatusSuccess,
  setErrorMessage,
  setLoading,
} from './reducer';

import {createLead, fetchBookingDetailsFromPhone} from '../../utils/api/yl.api';
import {isValidNumber} from '../../utils/isValidNumber';

import {navigate, replace} from '../../navigationRef';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';

import {
  localStorage,
  setCountryCallingCodeAsync,
} from '../../utils/storage/storage-provider';

import {setCurrentNetworkState} from '../network/reducer';
import {ERROR_MESSAGES} from '../../utils/constants/messages';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';
import {getCurrentDeviceId} from '../../utils/deviceId';
import DeviceInfo from 'react-native-device-info';
import {setBookingDetailSuccess} from '../join-demo/join-demo.reducer';
import {fetchDemoDetailsFromPhone} from '../join-demo/join-demo.saga';

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
function* handleBookingStatus({payload: {phone}}) {
  if (!phone) {
    yield put(setErrorMessage('Enter phone number'));
    return;
  }

  console.log(phone);

  try {
    // Check for length of a phone number according to country
    // Return true or false
    const isValidPhone = isValidNumber(phone, 'IN');

    if (!isValidPhone) {
      yield put(setErrorMessage('Please enter a valid number'));
      return;
    }

    // Get booking data
    const response = yield fetchBookingDetailsFromPhone(phone);

    const data = yield response.json();

    localStorage.set(LOCAL_KEYS.PHONE, parseInt(phone));

    if (response.status === 400) {
      console.log('booking not found');
      const deviceId = yield getCurrentDeviceId();
      const deviceUID = yield DeviceInfo.getAndroidId();
      const countryCode = 91;
      const courseId = 'Eng_Hw';

      const leadRes = yield createLead({
        phone,
        countryCode,
        courseId,
        deviceId,
        deviceUID,
      });
      const leadData = yield leadRes.json();
      console.log('leadData', leadData);
    }

    yield call(fetchDemoDetailsFromPhone);
    yield put(fetchBookingStatusSuccess(''));
    replace(SCREEN_NAMES.MAIN); // Redirect to main screen
    // }
  } catch (error) {
    console.log('BOOKING_STATUS_WELCOME_SCREEN_ERROR_SAGA', error);
    // if (error.message === ERROR_MESSAGES.NETWORK_STATE_ERROR) {
    //   yield put(setLoading(false));
    //   yield put(
    //     setCurrentNetworkState(fetchBookingStatusStart({phone, country})),
    //   );
    // } else {
    //   yield put(fetchBookingStatusFailed('Something went wrong'));
    // }

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
