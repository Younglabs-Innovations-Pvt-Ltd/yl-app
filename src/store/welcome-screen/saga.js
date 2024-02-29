import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchBookingStatusStart,
  fetchBookingStatusFailed,
  fetchBookingStatusSuccess,
  setErrorMessage,
  getCoursesForWelcomeScreen,
  getCoursesForWelcomeScreenFailed,
  getCoursesForWelcomeScreenSuccess,
  startGetAllBookings,
  getAllBookingsSuccess,
  setAllBookingsFetchingFailed,
  startFetchingUserOrders,
  userOrderFetchingSuccess,
  userOrdersLoadingFailed,
  setIsFirstTimeUser,
  setCustomer,
} from './reducer';

import {createLead} from '../../utils/api/yl.api';
import {
  fetchAllBookinsFromPhone,
  fetchAllOrdersFromLeadId,
  fetchCoursesForWelcomeScreen,
} from '../../utils/api/welcome.screen.apis';
import {isValidNumber} from '../../utils/isValidNumber';

import {replace} from '../../navigationRef';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';

import {localStorage} from '../../utils/storage/storage-provider';

import {LOCAL_KEYS} from '../../utils/constants/local-keys';
import {getCurrentDeviceId} from '../../utils/deviceId';
import DeviceInfo from 'react-native-device-info';
import {fetchUserFormLoginDetails} from '../auth/reducer';

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
function* handleBookingStatus({payload: {phone, ipData}}) {
  try {
    // Check for length of a phone number according to country
    // Return true or false
    // const isValidPhone = isValidNumber(phone, ipData.country_code2);

    // if (!isValidPhone) {
    //   yield put(setErrorMessage('Please enter a valid number'));
    //   return;
    // }

    const deviceId = yield getCurrentDeviceId();
    const deviceUID = yield DeviceInfo.getAndroidId();
    const countryCode = 91;
    const courseId = 'Eng_Hw';

    const leadBody = {
      phone,
      countryCode,
      courseId,
      deviceId,
      deviceUID,
      country: ipData.country_name.toUpperCase() || '',
      city: ipData.city || '',
      timezone: ipData.time_zone.offset_with_dst,
    };

    const leadRes = yield createLead(leadBody);
    const leadData = yield leadRes.json();

    if (leadData.customer === 'yes') {
      yield put(setCustomer('yes'));
      return;
    }

    localStorage.set(LOCAL_KEYS.PHONE, parseInt(phone));
    localStorage.set(
      LOCAL_KEYS.LOGINDETAILS,
      JSON.stringify({
        loginType: 'whatsAppNumber',
        phone,
      }),
    );

    yield put(fetchUserFormLoginDetails());
    yield put(fetchBookingStatusSuccess(''));
    replace(SCREEN_NAMES.MAIN); // Redirect to main screen
  } catch (error) {
    console.log('BOOKING_STATUS_WELCOME_SCREEN_ERROR_SAGA 4', error.message);

    yield put(fetchBookingStatusFailed('Something went wrong'));
  }
}

function* startBookingStatus() {
  yield takeLatest(fetchBookingStatusStart.type, handleBookingStatus);
}

function* startFetchingCoursesForLandingPage({payload}) {
  try {
    console.log('payload', payload);
    const country = payload.country?.toLowerCase();
    console.log('country: ', country);

    const res = yield fetchCoursesForWelcomeScreen(country);
    const data = yield res.json();
    // console.log("got data",data)

    if (data) {
      const formattedCourses = {
        handwriting: [],
        others: [],
      };
      data?.forEach(obj => {
        const {category} = obj;
        if (category === 'handwriting') {
          formattedCourses['handwriting'].push(obj);
        } else {
          formattedCourses['others'].push(obj);
        }
      });
      yield put(getCoursesForWelcomeScreenSuccess(formattedCourses));
    }
  } catch (error) {
    console.log('fetch courses error', error.message, ' payload was', payload);
    yield put(getCoursesForWelcomeScreenFailed());
  }
}

function* fetchingCourses() {
  yield takeLatest(
    getCoursesForWelcomeScreen.type,
    startFetchingCoursesForLandingPage,
  );
}

// Fetching user's all bookings
function* fetchAllBookings({payload}) {
  try {
    if (!payload) {
      return;
    }
    console.log('fetching bookings in api');
    const response = yield fetchAllBookinsFromPhone(payload);
    if (response.status !== 200 && response.status !== 404) {
      console.log('failing here', response.status);
      yield put(setAllBookingsFetchingFailed('Something went wrong'));
      return;
    }
    const data = yield response.json();
    // console.log('data is', data, 'for payload', payload);

    if (data?.message == 'bookings not found') {
      yield put(getAllBookingsSuccess([]));
      yield put(setIsFirstTimeUser(true));
      return;
    }

    if (data?.data) {
      const orignalObj = data.data;
      const newArray = Object.keys(orignalObj)?.map(key => {
        return {
          userName: key,
          ...orignalObj[key],
        };
      });

      const sortedArray = newArray.sort((a, b) => b.bookingId - a.bookingId);
      yield put(getAllBookingsSuccess(sortedArray));
    } else {
      yield put(getAllBookingsSuccess(null));
    }
  } catch (error) {
    console.error(error);
    console.log('Fetch all bookings error: ' + error.message);
    yield put(setAllBookingsFetchingFailed(error));
  }
}

function* fetchAllBookingsWithPhone() {
  yield takeLatest(startGetAllBookings.type, fetchAllBookings);
}

// fetching user's all orders
function* fetchAllOrders({payload}) {
  try {
    // console.log('fetching orders', payload);
    const response = yield fetchAllOrdersFromLeadId(payload);
    // console.log('got response', response, ' got status', response.status);

    if (response.status !== 200) {
      console.log('did not get response', response.status);
      yield put(userOrdersLoadingFailed('Something went Wrong'));
      return;
    }

    const data = yield response.json();
    // console.log('got order data', data);

    if (data?.orderData) {
      yield put(userOrderFetchingSuccess(data?.orderData));
    } else {
      yield put(userOrderFetchingSuccess([]));
    }
  } catch (error) {
    console.log('fetch_all_order_err', error.message);
    yield put(userOrdersLoadingFailed('Something went Wrong', payload));
  }
}

function* fetchAllOrdersOfUser() {
  yield takeLatest(startFetchingUserOrders.type, fetchAllOrders);
}

// Main saga
export function* welcomeScreenSagas() {
  yield all([
    call(startBookingStatus),
    call(fetchingCourses),
    call(fetchAllBookingsWithPhone),
    call(fetchAllOrdersOfUser),
  ]);
}
