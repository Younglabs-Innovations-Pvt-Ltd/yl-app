import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchBookingDetailsFromBookingId,
  fetchBookingDetils,
  updateChildName,
  getAcsToken,
  markAttendance,
  saveFreeClassRating,
  saveNeedMoreInfo,
  fetchBookingDetailsFromPhone,
  getAppTestimonials,
} from '../../utils/api/yl.api';

import {
  setBookingDetailSuccess,
  startFetchBookingDetailsFromId,
  startFetchBookingDetailsFromPhone,
  setPhoneAsync,
  setDemoPhone,
  setDemoData,
  setBookingTime,
  setIsAttended,
  setTeamUrl,
  joinFreeClass,
  setErrorMessage,
  saveRating,
  setIsRated,
  checkForRating,
  setRatingLoading,
  markNMI,
  markNMISuccess,
  setLoading,
  joinDemo,
  setClassOngoing,
  setDemoFlag,
  setJoinClassLoading,
  setJoinClassErrorMsg,
  startMarkAttendace,
  setAppRemark,
  setNMI,
} from './join-demo.reducer';

import {BASE_URL} from '@env';
import {startCallComposite} from '../../natiive-modules/team-module';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';
import {getCurrentDeviceId} from '../../utils/deviceId';
import {localStorage} from '../../utils/storage/storage-provider';
import moment from 'moment';
import {setContentData} from '../content/reducer';
import {redirectToCourse} from '../../utils/redirectToCourse';
import {navigate} from '../../navigationRef';

const TAG = 'JOIN_DEMO_SAGA_ERROR';

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param payload phone number
 * @description
 * Fetch demo details using phone number
 * Also fetch booking details
 * Save phone number to local storage
 */
export function* fetchDemoDetailsFromPhone({payload}) {
  try {
    const token = yield getCurrentDeviceId();
    const phone = payload?.phone;
    let callingCode = payload?.callingCode;
    callingCode = callingCode?.slice(1);
    delete payload?.callingCode;

    if (!phone) {
      yield put(setLoading(false));
      console.log('phone does not exist');
      return;
    }

    const response = yield call(fetchBookingDetailsFromPhone, phone, token);
    let data = yield response.json();

    console.log('phone is', callingCode.concat(phone));
    const detailsResponse = yield call(fetchBookingDetils, {
      phone: JSON.parse(callingCode.concat(phone)),
    });

    console.log('detailsResponse', detailsResponse.status);
    let bookingDetails = yield detailsResponse.json();

    if (response.status === 400) {
      data = null;
    }

    if (bookingDetails?.message === 'notFound') {
      bookingDetails = null;
    }

    const contentRes = yield call(getAppTestimonials);
    const {data: cData, content} = yield contentRes.json();
    const improvements = cData.filter(item => item.type === 'improvements');
    const reviews = cData.filter(item => item.type === 'review');
    const tips = cData.filter(item => item.type === 'tips');

    yield put(setBookingDetailSuccess({demoData: data, bookingDetails}));
    yield put(setContentData({improvements, reviews, tips, content}));
  } catch (error) {
    console.log('fetchDemoDetailsFromPhoneError', payload, error);
    yield put(setLoading(false));
    // yield put(setBookingDetailsFailed("Something went wrong, try again"))
    // if (error.message === ERROR_MESSAGES.NETWORK_STATE_ERROR) {
    //   yield put(setLoading(false));
    //   yield put(
    //     setCurrentNetworkState(startFetchBookingDetailsFromPhone(payload)),
    //   );
    // }
  }
}

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param payload booking id
 * @description
 * Fetch demo details using booking id
 * Also fetch booking details
 * Save booking id to local storage
 */
function* fetchDemoDetailsFromBookingId({payload}) {
  try {
    console.log('payload is for getting details', payload);
    const token = yield getCurrentDeviceId();

    const response = yield call(
      fetchBookingDetailsFromBookingId,
      payload,
      token,
    );
    const data = yield response.json();

    const detailsResponse = yield call(fetchBookingDetils, {
      bookingId: payload,
    });
    const bookingDetails = yield detailsResponse.json();

    yield put(setBookingDetailSuccess({demoData: data, bookingDetails}));
  } catch (error) {
    console.log(TAG, '3', error);
    console.log('error');
    // if (error.message === ERROR_MESSAGES.NETWORK_STATE_ERROR) {
    //   yield put(setLoading(false));
    //   yield put(
    //     setCurrentNetworkState(startFetchBookingDetailsFromId(payload)),
    //   );
    // }
  }
}

// Phone from local storage
function* getPhoneFromStorage() {
  try {
    const phoneFromAsyncStorage = localStorage.getNumber(LOCAL_KEYS.PHONE);

    if (phoneFromAsyncStorage) {
      yield put(setDemoPhone(phoneFromAsyncStorage));
    }
  } catch (error) {
    console.log(TAG, error);
  }
}

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param {object} payload demoData
 * @description Set demo data to states
 */
function* onSetDemoData({payload: {demoData, bookingDetails}}) {
  try {
    const demoTime = demoData?.demoDate?._seconds * 1000;
    console.log('demo time is', demoTime);

    if (demoTime) {
      const isClassOngoing =
        moment().isAfter(moment(demoTime)) &&
        moment().isBefore(moment(demoTime).add(50, 'minutes'));

      if (isClassOngoing) {
        yield put(setClassOngoing(true));
      } else {
        yield put(setClassOngoing(false));
      }
    }

    if (demoData.teamUrl) {
      yield put(setTeamUrl(demoData.teamUrl));
    }

    if (demoData.attendedOrNot) {
      console.log('demoData.attendedOrNot', demoData.attendedOrNot);
      yield put(setIsAttended(demoData.attendedOrNot));
    }

    if (demoData.demoFlag) {
      console.log('demoFag', demoData.demoFlag);
      yield put(setDemoFlag(demoData.demoFlag));
    }

    yield put(setAppRemark(bookingDetails.appRemark));
    yield put(setNMI(bookingDetails.needMoreInfo));
    yield put(setBookingTime(demoTime));

    yield put(setLoading(false));
  } catch (error) {
    console.log('setDemoData_error', error);
  }
}

// Save acs token in local storage
function* saveAcsTokenInLocalStorage({data}) {
  const expire = data.expireOn;
  if (expire) {
    localStorage.set(
      LOCAL_KEYS.ACS_TOKEN_EXPIRE,
      new Date(expire).getTime().toString(),
    );
  }
  localStorage.set(LOCAL_KEYS.ACS_TOKEN, data.token);

  return data.token;
}

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param bookingDetails an object that contains all booking related info
 * @param childName child name to join class
 * @param teamUrl join class using team url
 * @description
 * Join Demo Class
 * Save acs token to local storage using saveAcsTokenInLocalStorage function
 */
function* handleJoinClass({payload: {bookingDetails, childName, demoData}}) {
  if (!childName) {
    yield put(setErrorMessage('Please enter child name'));
    yield put(setJoinClassLoading(false));
    return;
  } else if (childName.toLowerCase().includes('@childname')) {
    yield put(setErrorMessage('Please enter child name'));
    yield put(setJoinClassLoading(false));
    return;
  }

  try {
    yield put(setJoinClassLoading(true));
    const bChildName = bookingDetails.childName;
    if (bChildName && bChildName.toLowerCase().includes('your child')) {
      yield call(updateChildName, {bookingDetails, childName});
    } else if (bChildName && bChildName.toLowerCase().includes('@childname')) {
      yield call(updateChildName, {bookingDetails, childName});
    }

    // Mark Attendance
    yield call(markAttendance, {
      bookingId: bookingDetails.bookingId,
    });

    if (!demoData?.demoFlag) {
      console.log('demoflag');
      yield call(handleJoinDemo, {
        payload: {bookingId: bookingDetails.bookingId},
      });
      // console.log('demoflagRes', yield demmoRes.json());
    }

    const token = yield getCurrentDeviceId();

    const response = yield call(
      fetchBookingDetailsFromPhone,
      bookingDetails.phone,
      token,
    );
    const data = yield response.json();

    if (data.teamUrl) {
      let token = localStorage.getString(LOCAL_KEYS.ACS_TOKEN);
      const tokenExpireTime = localStorage.getString(
        LOCAL_KEYS.ACS_TOKEN_EXPIRE,
      );
      const currentTime = Date.now();

      if (token) {
        const isTokenExpired =
          currentTime > new Date(parseInt(tokenExpireTime)).getTime();

        if (isTokenExpired) {
          const response = yield call(getAcsToken);

          const data = yield response.json();

          token = yield saveAcsTokenInLocalStorage({data});
        }
      } else {
        const response = yield call(getAcsToken);

        const data = yield response.json();

        token = yield saveAcsTokenInLocalStorage({data});
      }

      yield put(setErrorMessage(''));
      yield put(setJoinClassErrorMsg(''));
      yield put(setJoinClassLoading(false));
      localStorage.set(LOCAL_KEYS.JOIN_CLASS, 'true');
      startCallComposite(childName, data.teamUrl, token);
    } else {
      yield put(setJoinClassErrorMsg('Something went wrong'));
      yield put(setJoinClassLoading(false));
    }
  } catch (error) {
    console.log('JOIN_CLASS_ERROR_JOIN_DEMO_SAGA', error);
    yield put(setJoinClassErrorMsg('Something went wrong'));
    yield put(setJoinClassLoading(false));
  }
}

/**
 * @author Shobhit
 * @since 25/09/2023
 * @param bookingId booking id of free class
 * @param rating that user gives
 * @description Save user rating
 */
function* saveUserRating({payload: {bookingId, rating}}) {
  try {
    const response = yield call(saveFreeClassRating, {bookingId, rating});

    if (response.status === 200) {
      localStorage.set(LOCAL_KEYS.IS_RATED, true);
      yield put(setIsRated(true));
    }
  } catch (error) {
    console.log('JOIN_CLASS_ERROR_JOIN_DEMO_SAGA_RATING', error);
  }
}

// Check rating from local storage
function* checkRatingFromLocalStorage() {
  try {
    const rating = localStorage.getBoolean(LOCAL_KEYS.IS_RATED);
    console.log('rating', rating);
    if (rating) {
      yield put(setIsRated(true));
    }
    yield put(setRatingLoading(false));
  } catch (error) {
    console.log('async rated error', error);
  }
}

// Mark Attendace
function* markAttendaceSaga({payload: {bookingId}}) {
  try {
    const attendanceRes = yield call(markAttendance, {bookingId});

    if (attendanceRes.status === 200) {
      localStorage.set(LOCAL_KEYS.SAVE_ATTENDED, 'attended_yes');
    }
    console.log('markAttendance', yield attendanceRes.json());
    yield put(setIsAttended(true));
  } catch (error) {
    console.log('markAttendaceSaga error', error);
  }
}

/**
 * @author Shobhit
 * @since 25/09/2023
 * @param bookingId booking id of free class
 * @description Mark need more info
 */
function* handleNMI({payload: {bookingId, courseId, courses}}) {
  try {
    const response = yield saveNeedMoreInfo({bookingId});
    if (response.status === 200) {
      yield put(markNMISuccess());
      yield call(redirectToCourse, {
        navigate,
        courses,
        courseId,
        subScreen: 'payAndEnroll',
      });
    }
  } catch (error) {
    console.log('saveNMIError', error.message);
    yield put(markNMISuccess());
    // if (error.message === ERROR_MESSAGES.NETWORK_STATE_ERROR) {
    //   yield put(setCurrentNetworkState(markNMI({bookingId})));
    // } else {
    //   yield put(
    //     setErrorMessage('Something went wrong. Can not redirect on WhatsApp.'),
    //   );
    // }
  }
}

function* handleJoinDemo({payload: {bookingId}}) {
  try {
    const API_URL = `${BASE_URL}/admin/demoallocation/joindemo`;
    const response = yield fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({bookingId}),
    });
    const resData = yield response.json();
    console.log('joinDemoResData', resData);
    // if (response.status === 200) {
    //   yield call(fetchDemoDetailsFromPhone);
    // }
  } catch (error) {
    console.log('joinDemoError=', error);
  }
}

/**
 * Listener functions that call when dispatch a related action
 */

// start for phone number
function* demoBookingDetailsFromPhone() {
  yield takeLatest(
    startFetchBookingDetailsFromPhone().type,
    fetchDemoDetailsFromPhone,
  );
}

// start for booking id
function* demoBookingDetailsFromId() {
  yield takeLatest(
    startFetchBookingDetailsFromId().type,
    fetchDemoDetailsFromBookingId,
  );
}

// Get phone from local storage
function* startGetPhoneAsync() {
  yield takeLatest(setPhoneAsync.type, getPhoneFromStorage);
}

// Set demo data
function* startSetDemoData() {
  yield takeLatest(setDemoData.type, onSetDemoData);
}

// Join free demo class
function* joinClass() {
  yield takeLatest(joinFreeClass.type, handleJoinClass);
}

// Save user rating for free class
function* userRating() {
  yield takeLatest(saveRating.type, saveUserRating);
}

// Check for rating from local storage
function* checkRatingAsync() {
  yield takeLatest(checkForRating.type, checkRatingFromLocalStorage);
}

// Mark need more info
function* markNeedMoreInfo() {
  yield takeLatest(markNMI.type, handleNMI);
}

// Assign demo
function* joinDemoStart() {
  yield takeLatest(joinDemo.type, handleJoinDemo);
}

// Mark Attendance
function* markAttendanceListener() {
  yield takeLatest(startMarkAttendace.type, markAttendaceSaga);
}

// main saga
export function* joinDemoSaga() {
  yield all([
    call(demoBookingDetailsFromPhone),
    call(demoBookingDetailsFromId),
    call(startGetPhoneAsync),
    call(startSetDemoData),
    call(joinClass),
    call(userRating),
    call(checkRatingAsync),
    call(markNeedMoreInfo),
    call(joinDemoStart),
    call(markAttendanceListener),
  ]);
}
