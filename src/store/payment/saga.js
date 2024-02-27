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
import {Linking} from 'react-native';
import {replace} from '../../navigationRef';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';

function* payOnTazapay({body, ipData}) {
  try {
    // 1:- addToBag => get bagid
    // 2: - use bagid in createCheckout session
    // 3: - Get token from createCheckout session
    // 4: -send token to tazapay sdk on web

    const addToBagRes = yield fetch(`${BASE_URL}/shop/orderhandler/addToBag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bagDetails: {...body},
        leadId: body?.leadId,
      }),
    });

    if (addToBagRes.status !== 200) {
      console.log('did not get response');
      yield put(makePaymentFailed('Something went wrong'));
      return;
    }

    const {bagId} = yield addToBagRes.json();

    const createCheckoutSessionBody = {
      country: ipData?.country_code2, //ipData.country_code2 change with country
      bagId,
    };

    const checkOutSessionRes = yield fetch(
      `${BASE_URL}/payments/tazapay/createCheckoutSession`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createCheckoutSessionBody),
      },
    );

    if (checkOutSessionRes.status !== 200) {
      console.log('can not generate checkOutSession token');
      yield put(makePaymentFailed('Something went wrong'));
      return;
    }

    const {token} = yield checkOutSessionRes.json();
    const redirectUrl = `https://younglabs.in/yl_app/tazapay?token=${token}`;

    yield put(setLoading(false));
    yield Linking.openURL(redirectUrl);
  } catch (error) {
    console.log('error in tazapay', error.message);
    yield put(makePaymentFailed('Something went wrong'));
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
      childData,
      credits,
      paymentMethod,
    } = payload;
    console.log('Level text is', levelText);

    let selectBatch = {...currentSelectedBatch};

    selectBatch.price = parseInt(price);
    selectBatch.strikeThroughPrice = parseInt(strikeThroughPrice);
    selectBatch.levelText = levelText;
    selectBatch.courseType = courseDetails?.course_type;

    if (levelText === 'Foundation+Advanced') {
      selectBatch.actualItems = 2;
    } else {
      selectBatch.actualItems = 1;
    }

    const startDate = new Date(selectBatch.startDate._seconds * 1000);
    const startDateTime = moment(startDate).format('YYYY-MM-DD HH:mm');
    const countryCode = parseInt(ipData?.calling_code?.split('+')[1]);
    // const country = ipData?.country_name;
    const timezone = ipData?.time_zone?.offset;

    const daysArrString = selectBatch?.daysArr.split(',').join('');

    // console.log("selected Batch is" , selectBatch)

    const body = {
      courseType: selectBatch?.groupType,
      leadId: bookingDetails?.leadId,
      ageGroup: selectBatch?.ageGroup,
      courseId: selectBatch?.courseId,
      FCY: `${ipData?.currency?.code} ${selectBatch?.price}`,
      promisedStartDate: startDateTime,
      promisedBatchFrequency: daysArrString,
      phone: bookingDetails.phone,
      fullName: bookingDetails.fullName,
      batchId: selectBatch?.batchId,
      childName: childData?.name,
      email,
      childAge: childData?.age,
      timezone,
      countryCode,
      source: 'app',
      credits: credits || 0,
      country: ipData?.country_code2, // need to replace with ipdata country
    };

    if (payload?.offerCode) {
      body.offerCode = payload.offerCode;
    }

    if (payload?.discountedPrice) {
      body.discountedPrice = payload.discountedPrice;
    }

    // Save email to local storage
    localStorage.set(LOCAL_KEYS.EMAIL, body.email);
    const offeringBody = generateOffering(selectBatch);
    body.offeringData = offeringBody;

    console.log('payment method is', paymentMethod);
    if (paymentMethod === 'tazapay') {
      body.FCY = `QAR ${selectBatch?.price}`;
      yield payOnTazapay({body, ipData});
      return;
    }

    const token = yield auth().currentUser.getIdToken();
    // console.log('body=', body);
    const response = yield fetch(`${BASE_URL}/shop/orderhandler/makepayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (data?.order?.status === 'failed') {
      yield put(makePaymentFailed('Something went wrong'));
      return;
    }

    console.log('here 1', response.status);

    const data = yield response.json();

    console.log('here 2');

    console.log('data.order', data);

    const {amount, id: order_id, currency} = data.order;

    yield fetch(`${BASE_URL}/shop/orderhandler/addToBag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bagDetails: {...body, rpOrderId: order_id, type: 'order'},
        leadId: body?.leadId,
      }),
    });

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

    const options = {
      key: RP_KEY,
      currency,
      amount: amount?.toString(),
      order_id,
      name: 'Younglabs',
      description: 'Younglabs Innovations',
    };

    const rzRes = yield RazorpayCheckout.open(options);
    console.log('rzRes=', rzRes);

    if (rzRes.status_code === 200) {
      replace(SCREEN_NAMES.PAYMENT_SUCCESS);
    }
  } catch (error) {
    console.log(error);
    yield put(makePaymentFailed('Payment failed, try again later.'));
  }
}

function* makeSoloPaymentSaga({payload}) {
  try {
    const body = payload.body;
    const ipData = payload.ipData;
    const paymentMethod = payload.paymentMethod;

    let classesSold;
    if (body.classesSold && body.classesSold > 0) {
      classesSold = body.classesSold;
    } else {
      classesSold = 12; // changed it to 12 as 1 & 2 have 12 classes and combo has 12 class each
    }

    delete body.classesSold;

    let level = body?.level === 3 ? 1 : body.level;
    let batch = {
      ageGroup: body.ageGroup,
      batchType: body.batchType,
      classCount: classesSold,
      courseId: body.courseId,
      level,
      price: parseInt(body.discountedPrice || body.price),
      course_type: body.course_type,
    };

    delete body.course_type;

    console.log('leveltext is', body?.levelText);
    if (body.level === 3) {
      batch.actualItems = 2;
    } else {
      batch.actualItems = 1;
    }

    const offeringBody = generateOffering(batch);
    body.offeringData = offeringBody;

    // console.log("getting token", token)

    console.log('paymentMethod', paymentMethod);
    yield put(setLoading(false));
    // console.log('going to send body', body);

    if (paymentMethod === 'tazapay') {
      console.log('tpBody', body);

      yield payOnTazapay({body, ipData});
    } else {
      const token = yield auth().currentUser.getIdToken();

      const response = yield fetch(
        `${BASE_URL}/shop/orderhandler/makepayment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(body),
        },
      );

      const data = yield response.json();

      if (data.order.status === 'failed') {
        yield put(makePaymentFailed('Something went wrong'));
        return;
      }

      const {amount, id: order_id, currency} = data.order;

      yield fetch(`${BASE_URL}/shop/orderhandler/addToBag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bagDetails: {...body, rpOrderId: order_id, type: 'order'},
          leadId: body?.leadId,
        }),
      });

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

      console.log('i am her 3');

      const options = {
        key: RP_KEY,
        currency,
        amount: amount?.toString(),
        order_id,
        name: 'Younglabs',
        description: 'Younglabs Innovations',
      };

      const rzRes = yield RazorpayCheckout.open(options);
      console.log('rzRes=', rzRes);
      yield put(setLoading(false));
      if (rzRes.status_code === 200) {
        replace(SCREEN_NAMES.PAYMENT_SUCCESS);
      }
    }
  } catch (error) {
    console.log('getting err', error);
    yield put(makePaymentFailed('Payment failed, try again later.'));
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
