import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchBookingDetailsFromBookingId,
  fetchBookingDetailsFromPhone,
} from '../../utils/api/yl.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setBookingDetailSuccess,
  startFetchBookingDetailsFromId,
  startFetchBookingDetailsFromPhone,
} from './demo.reducer';

// Fetch booking details from phone number
function* fetchDemoDetailsFromPhone({payload}) {
  try {
    const response = yield call(fetchBookingDetailsFromPhone, payload);
    const data = yield response.json();
    // Check if phone number is not wrong
    if (response.status === 400) {
      yield put(setBookingDetailSuccess(data));
      return;
    }
    // set phone to local storage
    const phoneFromAsync = yield AsyncStorage.getItem('phone');
    if (!phoneFromAsync) {
      yield AsyncStorage.setItem('phone', payload);
    }
    yield put(setBookingDetailSuccess(data));
  } catch (error) {
    console.log('Demosaga_detail_phone', error);
  }
}

// Fetch booking details from booking id
function* fetchDemoDetailsFromBookingId({payload}) {
  try {
    const response = yield call(fetchBookingDetailsFromBookingId, payload);
    const data = yield response.json();

    yield put(setBookingDetailSuccess(data));
  } catch (error) {
    console.log('Demosaga_detail_booking_id', error);
  }
}

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

export function* demoSaga() {
  yield all([
    call(demoBookingDetailsFromPhone),
    call(demoBookingDetailsFromId),
  ]);
}
