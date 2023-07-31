import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  fetchBookingDetailsFromBookingId,
  fetchBookingDetailsFromPhone,
  fetchBookingDetils,
} from '../../utils/api/yl.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setBookingDetailSuccess,
  startFetchBookingDetailsFromId,
  startFetchBookingDetailsFromPhone,
} from './join-demo.reducer';

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

    const detailsResponse = yield call(fetchBookingDetils, {phone: payload});
    const bookingDetails = yield detailsResponse.json();
    // set phone to local storage
    const phoneFromAsync = yield AsyncStorage.getItem('phone');

    if (!phoneFromAsync) {
      yield AsyncStorage.setItem('phone', payload);
    }

    yield put(setBookingDetailSuccess({demoData: data, bookingDetails}));
  } catch (error) {
    console.log('Demosaga_detail_phone', error);
  }
}

// Fetch booking details from booking id
function* fetchDemoDetailsFromBookingId({payload}) {
  try {
    const response = yield call(fetchBookingDetailsFromBookingId, {
      bookingId: payload,
    });
    const data = yield response.json();

    const detailsResponse = yield call(fetchBookingDetils, {
      bookingId: payload,
    });
    const bookingDetails = yield detailsResponse.json();

    // set id to local storage
    const bookingIdFromAsync = yield AsyncStorage.getItem('bookingid');

    if (!bookingIdFromAsync) {
      console.log('save bookingid');
      yield AsyncStorage.setItem('bookingid', payload);
    }

    yield put(setBookingDetailSuccess({demoData: data, bookingDetails}));
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

export function* joinDemoSaga() {
  yield all([
    call(demoBookingDetailsFromPhone),
    call(demoBookingDetailsFromId),
  ]);
}
