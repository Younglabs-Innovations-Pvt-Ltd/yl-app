import {takeLatest, put, all, call} from 'redux-saga/effects';
import {
  fetchCourseFailed,
  fetchCourseStart,
  fetchCourseSuccess,
} from './course.reducer';
import {getCourseDetails} from '../../utils/api/course.api';

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

// Listeners
function* startFetchCourse() {
  yield takeLatest(fetchCourseStart.type, courseDetail);
}

// Main saga
export function* courseSagas() {
  yield all([call(startFetchCourse)]);
}
