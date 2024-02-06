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

export function* userSaga() {
  function* addChildSaga({payload}) {
    try {
      console.log('base url is', payload);
      const res = yield fetch(`${BASE_URL}/admin/app/addChildName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('got response');
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
      console.log('Child added successfully', data);
    } catch (error) {
      console.log('error in adding Child', error.message);
    }
  }

  function* fetchBookingByName({payload}) {
    console.log('fetching by name', payload);
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
