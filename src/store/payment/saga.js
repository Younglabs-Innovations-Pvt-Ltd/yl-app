import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
  startMakePayment,
  makePaymentFailed,
  makePaymentSuccess,
  setLoading,
  makeSoloPayment,
} from './reducer';
import moment from 'moment';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {generateOffering} from '../../utils/offering';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';
import RazorpayCheckout from 'react-native-razorpay';
import {MESSAGES} from '../../utils/constants/messages';
import {setEmail} from '../auth/reducer';
import {BASE_URL, RP_KEY} from '@env';
import {localStorage} from '../../utils/storage/storage-provider';
import auth from '@react-native-firebase/auth';

// const BASE_URL =
//   'https://ab9e-2401-4900-1f39-499e-170-a19-6bdb-716d.ngrok-free.app';

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
      childData,
      credits,
    } = payload;

    let selectBatch = {...currentSelectedBatch};

    selectBatch.price = parseInt(price);
    selectBatch.strikeThroughPrice = parseInt(strikeThroughPrice);
    // selectBatch.offeringId = offeringId;
    selectBatch.levelText = levelText;
    selectBatch.courseType = courseDetails?.course_type;

    if (levelText === 'Foundation+Advanced') {
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

    // console.log("selected Batch is" , selectBatch)
    const body = {
      courseType: selectBatch?.groupType,
      leadId: bookingDetails.leadId,
      ageGroup: selectBatch?.ageGroup,
      courseId: selectBatch?.courseId,
      FCY: `${ipData?.currency?.code} ${selectBatch?.price}`,
      promisedStartDate: startDateTime,
      promisedBatchFrequency: daysArrString,
      phone: bookingDetails.phone,
      fullName: bookingDetails.fullName,
      batchId: selectBatch?.batchId,
      childName: childData?.childName,
      email,
      childAge: childData?.childAge,
      timezone,
      countryCode,
      source: 'app',
      credits: credits || 0,
    };

    if (payload?.offerCode) {
      body.offerCode = payload.offerCode;
    }

    if (payload?.discountedPrice) {
      body.discountedPrice = payload.discountedPrice;
    }

    // const isEmail = yield AsyncStorage.getItem(LOCAL_KEYS.EMAIL);
    // if (!isEmail) {
    //   yield AsyncStorage.setItem(LOCAL_KEYS.EMAIL, body.email);
    // }
    // }

    // Save email to local storage
    localStorage.set(LOCAL_KEYS.EMAIL, body.email);

    const offeringBody = generateOffering(selectBatch);

    body.offeringData = offeringBody;

    const token = yield auth().currentUser.getIdToken();
    console.log('body=', body);

    const response = yield fetch(`${BASE_URL}/shop/orderhandler/makepayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 403) {
      yield put(setLoading(false));
      return;
    }

    const data = yield response.json();

    // console.log('order data=', data);

    const {amount, id: order_id, currency} = data.order;

    const orderResp = yield fetch(
      `${BASE_URL}/shop/orderhandler/addToBag`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bagDetails: {...body, rpOrderId: order_id, type: 'order'},
          leadId: body.leadId,
        }),
      },
    );

    const orderRes = yield orderResp.json();
    // console.log('orderRes=', orderRes);

    let config = {
      display: {
        blocks: {
          banks: {
            name: 'Pay via UPI',
            instruments: [
              {
                method: 'upi',
              },
            ],
          },
        },
        sequence: ['block.banks'],
        preferences: {
          show_default_blocks: false,
        },
      },
    };

    const options = {
      key:RP_KEY,
      currency,
      amount: amount?.toString(),
      order_id,
      name: 'Younglabs',
      description: 'Younglabs Innovations',
    };

    const rzRes = yield RazorpayCheckout.open(options);
    console.log('rzRes=', rzRes);
    if (rzRes) {
      yield put(makePaymentSuccess(MESSAGES.PAYMENT_SUCCESS));
      yield put(setEmail(body.email));
    }
  } catch (error) {
    console.log(error);
    yield put(makePaymentFailed('Payment failed, try again later.'));
  }
}

function* makeSoloPaymentSaga({payload}) {
  try {
    const body = payload.body;

    const url =
      'https://3671-2401-4900-1c5a-92a0-4868-58de-b7f8-1ce8.ngrok-free.app';

    const batch = {
      ageGroup: body.ageGroup,
      batchType: body.batchType,
      classCount: 12,
      courseId: body.courseId,
      level: 1,
      price: parseInt(body.price),
    };

    console.log('batch', batch);

    const offeringBody = generateOffering(batch);

    body.offeringData = offeringBody;

    const response = yield fetch(`${url}/shop/orderhandler/makepayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = yield response.json();

    console.log('order data=', data);

    if (response.status === 403) {
      // yield put(setLoading(false));
      return;
    }

    const {amount, id: order_id, currency} = data.order;

    const orderResp = yield fetch(`${url}/shop/orderhandler/addToBag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bagDetails: {...body, rpOrderId: order_id, type: 'order'},
        leadId: body.leadId,
      }),
    });

    const orderRes = yield orderResp.json();
    console.log('orderRes=', orderRes);

    let config = {
      display: {
        blocks: {
          banks: {
            name: 'Pay via UPI',
            instruments: [
              {
                method: 'upi',
              },
            ],
          },
        },
        sequence: ['block.banks'],
        preferences: {
          show_default_blocks: false,
        },
      },
    };

    const options = {
      key: 'rzp_test_0cYlLVRMEaCUDx',
      currency,
      amount: amount?.toString(),
      order_id,
      name: 'Younglabs',
      description: 'Younglabs Innovations',
    };

    const rzRes = yield RazorpayCheckout.open(options);
    console.log('rzRes=', rzRes);
  } catch (error) {
    console.log(error);
  }
}

function* makePaymentListener() {
  yield takeLatest(startMakePayment.type, makePaymentSaga);
}

function* soloPaymentListener() {
  yield takeLatest(makeSoloPayment.type, makeSoloPaymentSaga);
}

export function* paymentSaga() {
  yield all([call(makePaymentListener), call(soloPaymentListener)]);
}
