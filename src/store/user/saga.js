import {all, call, put, takeLatest} from 'redux-saga/effects';
import auth from '@react-native-firebase/auth';
import {
  childAdded,
  setChildAddSuccess,
  setChildren,
  setCurrentChild,
  startAddingChild,
  startEditChild,
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

  function* fetchBookingByName({payload}) {}

  function* editChildFunction({payload}) {
    try {
      const close = payload?.close;
      delete payload.close;

      console.log('sending payload to child', payload);
      const response = yield fetch(`${BASE_URL}/admin/app/updateChildName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = yield response.json();

      if (data?.data?.children) {
        console.log('got data in return', data?.data?.children);
        yield put(setChildren(data?.data?.children));
      }
      Snackbar.show({
        text: 'Child Edited Successfully',
        textColor: 'white',
        duration: Snackbar.LENGTH_LONG,
      });
      close && close();
      yield put(setChildAddSuccess(true));
    } catch (error) {
      console.log('edit child error', error);
      yield put(setChildAddSuccess(false));
    }
  }

  function* startAddingChildListner() {
    yield takeLatest(startAddingChild.type, addChildSaga);
  }

  function* childrendAddEffect({payload}) {
    if (payload && payload.length > 0) {
      console.log('in if condition');
      yield put(setCurrentChild(payload[0]));
    }
  }

  function* setChildrenListner() {
    yield takeLatest(setChildren.type, childrendAddEffect);
  }

  function* startFetchBookingDetailsByNameListner() {
    yield takeLatest(startFetchBookingDetailsByName.type, fetchBookingByName);
  }

  function* editChildListner() {
    yield takeLatest(startEditChild.type, editChildFunction);
  }

  yield all([
    call(startAddingChildListner),
    call(setChildrenListner),
    call(startFetchBookingDetailsByNameListner),
    call(editChildListner),
  ]);
}
