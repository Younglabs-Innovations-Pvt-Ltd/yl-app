import {takeLatest, put, all, call} from 'redux-saga/effects';
import {
  fetchCourseFailed,
  fetchCourseStart,
  fetchCourseSuccess,
  fetchCourseVideos,
  setCourseVideos,
} from './course.reducer';
import {getCourseDetails} from '../../utils/api/course.api';
import {getCourseVideo} from '../../utils/api/yl.api';

function* courseDetail({payload}) {
  try {
    const {courseId} = payload;
    const response = yield call(getCourseDetails, courseId);
    const data = yield response.json();
    yield put(fetchCourseSuccess({...data, courseId}));
  } catch (error) {
    console.log('FETCH_COURSE_ERROR=', error);
    yield put(fetchCourseFailed({message: 'Something went wrong.'}));
  }
}

function* fetchCourseVideosSaga() {
  try {
    const res = yield getCourseVideo({courseId: 'Eng_Hw'});
    const videoData = yield res.json();
    yield put(setCourseVideos(videoData?.data));
  } catch (error) {
    console.log('fetchCourseVideosError', error.message);
  }
}

// Listeners
function* startFetchCourse() {
  yield takeLatest(fetchCourseStart.type, courseDetail);
}

function* fetchCourseListener() {
  yield takeLatest(fetchCourseVideos.type, fetchCourseVideosSaga);
}

// Main saga
export function* courseSagas() {
  yield all([call(startFetchCourse), call(fetchCourseListener)]);
}
