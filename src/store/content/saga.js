import {all, call, put, takeLatest} from 'redux-saga/effects';
import {fetchContentDataStart, setContentData} from './reducer';
import {getAppTestimonials} from '../../utils/api/yl.api';

function* fetchContentDataSaga() {
  try {
    const response = yield getAppTestimonials();
    const {data, content} = yield response.json();
    const improvements = data.filter(item => item.type === 'improvements');
    const reviews = data.filter(item => item.type === 'review');
    const tips = data.filter(item => item.type === 'tips');

    yield put(setContentData({improvements, reviews, tips, content}));
  } catch (error) {
    console.log('contentDataSagaError', error.message);
  }
}

function* fetchDataListener() {
  yield takeLatest(fetchContentDataStart.type, fetchContentDataSaga);
}

export function* contentSaga() {
  yield all([call(fetchDataListener)]);
}
