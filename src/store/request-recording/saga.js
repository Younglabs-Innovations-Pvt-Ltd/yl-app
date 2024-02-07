import {all, call, put, takeLatest} from 'redux-saga/effects';
import auth from '@react-native-firebase/auth';
import {
  startRecordingRequest,
  ClasseRecordingRequestSuccess,
  ClasseRecordingRequestFailure,
} from './reducer';
import {requestRecording} from '../../utils/api/requestRecording.api';

function* handleClassRequestRecording({payload}) {
//   console.log('calling requestRecording function', payload);
  try {
    const token = yield auth().currentUser.getIdToken();
    const response = yield requestRecording({
      classId: payload.classId,
      leadId: payload.leadId,
      token,
    });
    if (response.status != 200) {
      return;
    }
    const data = yield response.json();
    yield put(ClasseRecordingRequestSuccess(data));
  } catch (error) {
    yield put(ClasseRecordingRequestFailure());
  }
}

function* startRequestingClassRecording() {
  yield takeLatest(startRecordingRequest.type, handleClassRequestRecording);
}

// main saga
export function* handleClasseRecordingRequestSaga() {
  yield all([call(startRequestingClassRecording)]);
}
