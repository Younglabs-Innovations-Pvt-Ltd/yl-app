import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchBookingStatusStart,
  fetchBookingStatusFailed,
  fetchBookingStatusSuccess,
  setErrorMessage,
  getCoursesForWelcomeScreen,
  setLoading,
  getCoursesForLoadingScreenFailed,
  getCoursesForWelcomeScreenSuccess,
  startGetAllBookings,
  getAllBookingsSuccess,
  setAllBookingsFetchingFailed,
  startFetchingUserOrders,
  userOrderFetchingSuccess,
  userOrdersLoadingFailed,
  setSelectedUserOrder,
} from './reducer';

import {fetchBookingDetailsFromPhone} from '../../utils/api/yl.api';
import {
  fetchAllBookinsFromPhone,
  fetchAllOrdersFromLeadId,
  fetchCoursesForWelcomeScreen,
} from '../../utils/api/welcome.screen.apis';
import {isValidNumber} from '../../utils/isValidNumber';

import {navigate, replace} from '../../navigationRef';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';

import {
  setCountryCallingCodeAsync,
  setLocalPhoneAsync,
} from '../../utils/storage/storage-provider';

import {setCurrentNetworkState} from '../network/reducer';
import {ERROR_MESSAGES} from '../../utils/constants/messages';

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
    const isValidPhone = isValidNumber(phone, 'IN');

    // if (!isValidPhone) {
    //   yield put(setErrorMessage('Please enter a valid number'));
    //   return;
    // }

    // Get booking data
    // const response = yield fetchBookingDetailsFromPhone(phone);

    // if (response.status === 400) {
    //   // Booking not found
    //   navigate(SCREEN_NAMES.BOOK_DEMO_FORM, {phone, country}); //Redirect to BookDemoForm Screen
    //   yield put(setErrorMessage(''));
    //   return;
    // }

    // if (response.status === 200) {
    // yield setLocalPhoneAsync(phone);
    // yield setCountryCallingCodeAsync(country.callingCode);

    yield put(fetchBookingStatusSuccess(''));
    replace(SCREEN_NAMES.MAIN); // Redirect to main screen
    // }
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
    const res = yield fetchCoursesForWelcomeScreen(country);
    const data = yield res.json();
    yield put(getCoursesForWelcomeScreenSuccess(data));
  } catch (error) {
    yield put(getCoursesForLoadingScreenFailed());
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
    console.log('fetching bookings in api');
    const response = yield fetchAllBookinsFromPhone(payload);
    const data = yield response.json();

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
    console.log('getting payload in');
    const response = yield fetchAllOrdersFromLeadId(payload);



    const data = yield response.json();
    console.log('get courses', data , response.status);

    if (data?.orderData) {
      console.log('in if condition');
      const formattedOrders = {};
      data?.orderData?.forEach(obj => {
        const {childName} = obj;

        if (!formattedOrders[childName]) {
          formattedOrders[childName] = [];
        }
        formattedOrders[childName].push(obj);
      });
      const initialKey = Object.keys(formattedOrders)[0];
      const initialValue = Object.values(formattedOrders)[0];
      console.log("initial key: " + initialKey , " initial value: " + initialValue)
      yield put(setSelectedUserOrder({[initialKey]: initialValue}));
      yield put(userOrderFetchingSuccess(formattedOrders));
    }
    else{
      console.log("not data in order")
    }
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
