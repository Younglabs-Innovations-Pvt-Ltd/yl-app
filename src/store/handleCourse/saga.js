import {all, call, put, takeLatest} from 'redux-saga/effects';
import auth from '@react-native-firebase/auth';
import {
  fetchServiceRequestClassesFailure,
  fetchServiceRequestClassesSuccess,
  startFetchServiceRequestClasses,
} from './reducer';
import {getClasses} from '../../utils/api/course.api';

function* fetchAllClasses({payload}) {
  console.log('serviceRequestId', payload);
  try {
    const token = yield auth().currentUser.getIdToken();

    const response = yield getClasses({
      leadId: payload.leadId,
      token,
      serviceRequestId: payload.serviceRequestId,
    });
    if (response.status != 200) {
      console.log('leadId1: ', payload.leadId);
    console.log('ServiceRequest1: ', payload.serviceRequestId);
    console.log('token1: ', token);
    console.log('response Status1: ', response.status);
      console.log('Failed to fetch1', response);
      return;
    }
    const data = yield response.json();
    console.log('leadId: ', payload.leadId);
    console.log('ServiceRequest: ', payload.serviceRequestId);
    console.log('token: ', token);
    console.log('response Status: ', response.status);
    // console.log('getClassesData', data);
    yield put(fetchServiceRequestClassesSuccess(data));
  } catch (error) {
    yield put(fetchServiceRequestClassesFailure());
    // console.log('fetch class error', error.message);
  }
}

function* startGetClasses() {
  yield takeLatest(startFetchServiceRequestClasses.type, fetchAllClasses);
}

// main saga
export function* handleCourseSaga() {
  yield all([call(startGetClasses)]);
}
