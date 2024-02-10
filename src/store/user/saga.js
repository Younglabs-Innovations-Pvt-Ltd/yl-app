import {all, call, put, takeLatest} from 'redux-saga/effects';
import auth from '@react-native-firebase/auth';
import {
  childAdded,
  setChildren,
  setCurrentChild,
  startAddingChild,
  startFetchBookingDetailsByName,
} from './reducer';
import {BASE_URL} from '@env';
import {setUserManually} from '../auth/reducer';
import Snackbar from 'react-native-snackbar';

export function* userSaga() {
  function* addChildSaga({payload}) {
    try {
      const onClose = payload.onClose;
      delete payload.onClose;
      const res = yield fetch(`${BASE_URL}/admin/app/addChildName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      // console.log('got response');
      if (res.status !== 200 && res.status !== 400) {
        console.log('adding child failed', res.status);
        yield put(childAdded(false));
        return;
      }
      const data = yield res.json();
      if (data.message === 'child limit exceeded') {
        yield put(childAdded(false));
        return;
      }

      yield put(setChildren(data?.data?.children));
      yield put(childAdded(true));
      Snackbar.show({
        text: 'Child Added Successfully',
        textColor: 'white',
        duration: Snackbar.LENGTH_LONG,
      });
      onClose();
      console.log('Child added successfully', data);
    } catch (error) {
      console.log('error in adding Child', error.message);
    }
  }

  function* fetchBookingByName({payload}) {
    // console.log('fetching by name', payload);
    // const response = yield put(fetchBookingDetails(payload));
    // const data = yield response.json();
    // const detailsResponse = yield call(fetchBookingDetils, {
    //   bookingId: payload,
    // });
    // const bookingDetails = yield detailsResponse.json();
    // // set id to local storage
    // // const bookingIdFromAsync = yield AsyncStorage.getItem(
    // //   LOCAL_KEYS.BOOKING_ID,
    // // );
    // // if (!bookingIdFromAsync) {
    // //   yield AsyncStorage.setItem(LOCAL_KEYS.BOOKING_ID, payload);
    // // }
    // yield put(setBookingDetailSuccess({demoData: data, bookingDetails}));
  }

  function* startAddingChildListner() {
    yield takeLatest(startAddingChild.type, addChildSaga);
  }

  function* childrendAddEffect({payload}) {
    if (payload && payload.length > 0) {
      setCurrentChild(payload[0]);
    }
  }

  function* setChildrenListner() {
    yield takeLatest(setChildren.type, childrendAddEffect);
  }

  function* startFetchBookingDetailsByNameListner() {
    yield takeLatest(startFetchBookingDetailsByName.type, fetchBookingByName);
  }

  yield all([
    call(startAddingChildListner),
    call(setChildrenListner),
    call(startFetchBookingDetailsByNameListner),
  ]);
}
