import {takeLatest, put, all, call} from 'redux-saga/effects';
import {
  fetchCourseFailed,
  fetchCourseStart,
  fetchCourseSuccess,
  makePayment,
} from './course.reducer';
import {getCourseDetails} from '../../utils/api/course.api';
import moment from 'moment';

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

function* makePaymentSaga({payload}) {
  try {
    const {
      price,
      strikeThroughPrice,
      currentSelectedBatch,
      levelText,
      ipData,
      bookingDetails,
      courseDetails,
      email,
    } = payload;

    let selectBatch = {...currentSelectedBatch};

    selectBatch.price = parseInt(price);
    selectBatch.strikeThroughPrice = parseInt(strikeThroughPrice);
    // selectBatch.offeringId = offeringId;
    selectBatch.levelText = levelText;
    selectBatch.courseType = courseDetails?.course_type;

    if (levelText === 'Foundation + Advanced') {
      selectBatch.actualItems = 2;
    } else {
      selectBatch.actualItems = 1;
    }

    const startDate = new Date(selectBatch.startDate._seconds * 1000);

    const startDateTime = moment(startDate).format('YYYY-MM-DD HH:mm');

    const countryCode = parseInt(ipData?.calling_code.split('+')[1]);
    // const country = ipData?.country_name;
    const timezone = ipData?.time_zone?.offset;

    const daysArrString = selectBatch?.daysArr.split(',').join('');

    const body = {
      courseType: selectBatch?.courseType,
      leadId: bookingDetails.leadId,
      ageGroup: selectBatch?.ageGroup,
      courseId: selectBatch?.courseId,
      FCY: `${ipData?.currency?.code} ${selectBatch?.price}`,
      promisedStartDate: startDateTime,
      promisedBatchFrequency: daysArrString,
      phone: bookingDetails.phone,
      fullName: bookingDetails.parentName,
      batchId: selectBatch?.batchId,
      childName: bookingDetails.childName,
      email,
      childAge: bookingDetails.childAge,
      timezone,
      countryCode,
    };

    console.log('body', body);

    // const offeringBody = generateOffering(selectBatch);

    // body.offeringData = offeringBody;
    // console.log('body=', body);

    // const response = yield fetch(`${BASE_URL}/shop/orderhandler/makepayment`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(body),
    // });

    // const data = yield response.json();

    // console.log(data);

    // const {amount, id: order_id, currency} = data.order;

    // const orderResp = yield fetch(`${BASE_URL}/shop/orderhandler/addToBag`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     bagDetails: {...body, rpOrderId: order_id, type: 'order'},
    //     leadId: body?.leadId,
    //   }),
    // });

    // const orderRes = yield orderResp.json();
    // console.log(orderRes);

    // let config = {
    //   display: {
    //     blocks: {
    //       banks: {
    //         name: 'Pay via UPI',
    //         instruments: [
    //           {
    //             method: 'upi',
    //           },
    //         ],
    //       },
    //     },
    //     sequence: ['block.banks'],
    //     preferences: {
    //       show_default_blocks: false,
    //     },
    //   },
    // };

    // const options = {
    //   key: 'rzp_test_0cYlLVRMEaCUDx',
    //   currency,
    //   amount: amount?.toString(),
    //   order_id,
    //   name: 'Young Labs',
    //   description: 'Younglabs Innovations',
    // };

    // RazorpayCheckout.open(options)
    //   .then(async data => {
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     // handle failure
    //     alert(`Error: ${error.code} | ${error.description}`);
    //   });
  } catch (error) {
    console.log(error);
  }
}

// Listeners
function* startFetchCourse() {
  yield takeLatest(fetchCourseStart.type, courseDetail);
}

function* startMakePayment() {
  yield takeLatest(makePayment.type, makePaymentSaga);
}

// Main saga
export function* courseSagas() {
  yield all([call(startFetchCourse), call(startMakePayment)]);
}
