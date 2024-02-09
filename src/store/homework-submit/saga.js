import {all, call, put, takeLatest} from 'redux-saga/effects';
import auth from '@react-native-firebase/auth';
import {
  startSubmittingClasseHomeWork,
  ClassesHomeWorkSubmitedSuccess,
  ClassesHomeWorkSubmitFailure,
} from './reducer';
import {submitHomeWork} from '../../utils/api/submitHomeWork.api';
import Snackbar from 'react-native-snackbar';

function* handleSubmitHomeWork({payload}) {
  try {
    const token = yield auth().currentUser.getIdToken();
    const response = yield submitHomeWork({
      path: payload?.path,
      classId: payload.classId,
      homeworkUrls: payload?.homeworkUrls,
      type: payload?.type,
      leadId: payload.leadId,
      token,
      serviceRequestId: payload.serviceRequestId,
      allImages: payload.allImages,
      serviceRequestId: payload.serviceRequestId,
    });
    console.log('responseresponseresponse', response.status);
    Snackbar.show({
      text: 'Homework submitted successfully',
      textColor: 'white',
      duration: Snackbar.LENGTH_LONG,
    });
    if (response.status != 200) {
      return;
    }
    const data = yield response.json();
    yield put(ClassesHomeWorkSubmitedSuccess(data));
  } catch (error) {
    yield put(ClassesHomeWorkSubmitFailure());
  }
}

function* startSubmittedClassHomeWork() {
  yield takeLatest(startSubmittingClasseHomeWork.type, handleSubmitHomeWork);
}

// main saga
export function* handleClassesHomeWorkSubmitSaga() {
  yield all([call(startSubmittedClassHomeWork)]);
}
