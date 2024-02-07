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

  try {
    // Check for length of a phone number according to country
    // Return true or false
    const isValidPhone = isValidNumber(phone, 'IN');

    if (!isValidPhone) {
      yield put(setErrorMessage('Please enter a valid number'));
      return;
    }

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

    yield put(fetchBookingStatusSuccess(''));
    replace(SCREEN_NAMES.MAIN); // Redirect to main screen
  } catch (error) {
    console.log('BOOKING_STATUS_WELCOME_SCREEN_ERROR_SAGA 4', error.message);
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

function* startFetchingCoursesForLandingPage({payload}) {
  try {
    const country = payload.country;
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
      // console.log("Formatted Course is", formattedCourses)
      yield put(getCoursesForWelcomeScreenSuccess(formattedCourses));
    }
  } catch (error) {
    console.log('fetch courses error', error.message);
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
    const response = yield fetchAllOrdersFromLeadId(payload);
    // console.log('got response', response, ' got status', response.status);
    console.log('got response', response.status);
    if (response.status !== 200) {
      yield put(userOrdersLoadingFailed('Something went Wrong'));
      return;
    }

    const data = yield response.json();

    if (data?.orderData) {
      yield put(userOrderFetchingSuccess(data?.orderData));
    } else {
      yield put(userOrderFetchingSuccess([]));
    }
    // console.log('get courses', data, response.status);

    // if (data?.orderData) {
    //   const formattedOrders = {};
    //   data?.orderData?.forEach(obj => {
    //     const {childName} = obj;
    //     if (!formattedOrders[childName]) {
    //       formattedOrders[childName] = [];
    //     }
    //     formattedOrders[childName].push(obj);
    //   });
    //   const initialKey = Object.keys(formattedOrders)[0];
    //   const initialValue = Object.values(formattedOrders)[0];
    //   yield put(setSelectedUserOrder({[initialKey]: initialValue}));
    //   yield put(userOrderFetchingSuccess(formattedOrders));
    // } else {
    //   console.log('not data in order');
    // }
  } catch (error) {
    console.log('fetch_all_order_err', error.message);
    yield put(userOrdersLoadingFailed('Something went Wrong'));
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
