import {all, call, put, takeLatest} from 'redux-saga/effects';
import auth from '@react-native-firebase/auth';
import {
  phoneAuthStart,
  phoneAuthFailed,
  setConfirm,
  fetchUser,
  setUser,
  setIsCustomer,
  logout,
  fetchUserFormLoginDetails,
  fetchReferralCode,
  fetchReferralCodeSuccess,
  fetchReferralCodeFailed,
} from './reducer';
import {setChildren, setCurrentChild} from '../user/reducer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../../utils/storage/local-storage-keys';
import {isValidNumber} from '../../utils/isValidNumber';
import {getCustomers} from '../../utils/api/yl.api';
import {localStorage} from '../../utils/storage/storage-provider';
import {resetNavigation} from '../../navigationRef';
import {setIsFirstTimeUser} from '../welcome-screen/reducer';
import {BASE_URL} from '@env';

function* phoneAuthentication({payload: {phone}}) {
  try {
    if (!phone) {
      yield put(phoneAuthFailed('Enter phone number'));
      return;
    }

    const isValidPhone = isValidNumber(phone, 'IN');

    if (!isValidPhone) {
      yield put(phoneAuthFailed('Please enter a valid number'));
      return;
    }

    // yield AsyncStorage.setItem(LOCAL_KEYS.PHONE, phone);
    localStorage.set(LOCAL_KEYS.PHONE, parseInt(phone));
    localStorage.set(LOCAL_KEYS.CALLING_CODE, '+91');
    const confirmation = yield auth().signInWithPhoneNumber(`+91${phone}`);
    yield put(setConfirm(confirmation));
  } catch (error) {
    console.log(error);
    if (error.code === 'auth/too-many-requests') {
      yield put(
        phoneAuthFailed('Too many attempts, try again after some time.'),
      );
    } else {
      yield put(phoneAuthFailed('Something went wrong, try again later.'));
    }
  }
}

function* fetchUserSaga({payload}) {
  try {
    if (!payload) {
      return;
    }
    console.log('getting response');
    const res = yield getCustomers(payload);
    console.log('res status', res.status);
    const data = yield res.json();
    console.log('got user data', data);
    if (data?.data?.customer === 'yes') {
      console.log('sttin customer');
      yield put(setIsCustomer(true));
    }

    if (data?.data?.children && data?.data?.children?.length > 0) {
      let arr = data?.data?.children;
      let objWithBooking = arr.filter(item => item.bookingId);
      let objWithoutBooking = arr.filter(item => !item.bookingId);
      let sortedList = objWithBooking.sort((a, b) => b.bookingId - a.bookingId);
      let finalArray = [...sortedList, ...objWithoutBooking];
      console.log(
        'setting current Child',
        finalArray[0]?.name,
        finalArray[0].bookingId,
      );
      yield put(setCurrentChild(finalArray[0]));
      yield put(setChildren(finalArray));
    } else {
      yield put(setIsFirstTimeUser(true));
    }

    yield put(setUser(data?.data));
  } catch (error) {
    console.log('FETCH_USER_ERROR', payload, error.message);
  }
}

// listeners
function* startAuthentication() {
  yield takeLatest(phoneAuthStart.type, phoneAuthentication);
}

function* fetchUserListener() {
  yield takeLatest(fetchUser.type, fetchUserSaga);
}

function* logoutFunc() {
  localStorage.clearAll();

  const currentUser = auth().currentUser;
  if (currentUser) {
    yield auth().signOut();
  }

  resetNavigation();
  // navigate(SCREEN_NAMES.WELCOME);
}

function* getReferralcode({payload}) {
  try {
    console.log('calling api', payload);
    const response = yield fetch(
      `${BASE_URL}/admin/referrals/getreferralCode`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    if (response.status !== 200) {
      console.error('Error did not get response', response.status);
      yield put(fetchReferralCodeFailed(true));
      return;
    }

    const data = yield response.json();

    if (data?.referralCode) {
      yield put(fetchReferralCodeSuccess(data.referralCode));
      return;
    }

    yield put(fetchReferralCodeFailed(true));
  } catch (error) {
    yield put(fetchReferralCodeFailed(true));

    console.error('Error getting refercode', error.message);
  }
}

function* getUserReferralCode() {
  yield takeLatest(fetchReferralCode.type, getReferralcode);
}

function* logoutUser() {
  yield takeLatest(logout.type, logoutFunc);
}

function* fetchUserFormLoginDetailsFunc() {
  let loginDetails = localStorage.getString('loginDetails');
  console.log('fetching user...');
  loginDetails = JSON.parse(loginDetails);
  console.log('got login details: ' + loginDetails.loginType);

  if (!loginDetails) {
    yield put(logout());
  }
  // console.log('login details is', loginDetails);
  if (loginDetails.loginType === 'whatsAppNumber') {
    console.log('getting user by', loginDetails.phone);
    yield put(fetchUser({phone: loginDetails.phone}));
  } else if (loginDetails.loginType === 'customerLogin') {
    console.log('getting user by', loginDetails.email);
    yield put(fetchUser({email: loginDetails.email}));
    yield put(setIsCustomer(true));
  }
}

function* fetchUserFormLoginDetailsListner() {
  yield takeLatest(fetchUserFormLoginDetails, fetchUserFormLoginDetailsFunc);
}
export function* authSaga() {
  yield all([
    call(startAuthentication),
    call(fetchUserListener),
    call(logoutUser),
    call(fetchUserFormLoginDetailsListner),
    call(getUserReferralCode),
  ]);
}
