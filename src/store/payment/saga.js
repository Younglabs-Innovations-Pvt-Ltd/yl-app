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

function* payOnTazapay({body, ipData}) {
  try {
    // console.log('got body', body);

    // 1:- addToBag => get bagid
    // 2: - use bagid in createCheckout session
    // 3: - Get token from createCheckout session
    // 4: -send token to tazapay sdk on web

    // console.log('calling add to bag' , body , " ipdata", ipData);
    // return;

    // Getting bag Id
    console.log('in tazapay session');
    console.log('tpBody', body);
    const url =
      'https://307b-2401-4900-1c5c-3da3-d51-cedb-e809-a72b.ngrok-free.app';
    const addToBagRes = yield fetch(`${url}/shop/orderhandler/addToBag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bagDetails: {...body},
        leadId: body?.leadId,
      }),
    });
    console.log('got addToBagRes', addToBagRes.status);

    if (addToBagRes.status !== 200) {
      console.log('did not get response');
      return;
    }

    const {bagId} = yield addToBagRes.json();

    // const currency = body.FCY.split(' ')[0];
    // getting checkOutSession token
    const createCheckoutSessionBody = {
      // email: body.email,
      // invoiceCurrency: 'QAR', //change with currency
      // name: body.fullName,
      country: 'QA', //ipData.country_code2 change with country
      // phone: body.phone,
      // callingCode: body.countryCode,
      // amount: body.price,
      bagId,
    };
    console.log('callingCheckOutSession with body', createCheckoutSessionBody);

    const checkOutSessionRes = yield fetch(
      `${url}/payments/tazapay/createCheckoutSession`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createCheckoutSessionBody),
      },
    );
    console.log('got checkOutSession res', checkOutSessionRes.status);

    if (checkOutSessionRes.status !== 200) {
      console.log('can not generate checkOutSession token');
      return;
    }

    const {token} = yield checkOutSessionRes.json();
    console.log('token is', token);
    const redirectUrl = `https://younglabsdev1.vercel.app/yl_app/tazapay?token=${token}`;
    console.log('redirectUrl', redirectUrl);

    yield Linking.openURL(redirectUrl);
  } catch (error) {
    console.log('error in tazapay', error.message);
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
      country: 'QA', // need to replace with ipdata country
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

    console.log('paying on ', paymentMethod);
    if (paymentMethod === 'tazapay') {
      body.FCY = `QAR ${selectBatch?.price}`;
      yield payOnTazapay({body, ipData});
      return;
    }

    const token = yield auth().currentUser.getIdToken();
    console.log('body=', body);

    const url =
      'https://5963-2401-4900-1c5c-3da3-d51-cedb-e809-a72b.ngrok-free.app';
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

    console.log('here 1', response.status);

    const data = yield response.json();

    console.log('here 2');

    const {amount, id: order_id, currency} = data.order;

    const orderResp = yield fetch(`${BASE_URL}/shop/orderhandler/addToBag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bagDetails: {...body, rpOrderId: order_id, type: 'order'},
        leadId: body?.leadId,
      }),
    });

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
      key: 'rzp_test_0cYlLVRMEaCUDx',
      currency,
      amount: amount?.toString(),
      order_id,
      name: 'Younglabs',
      description: 'Younglabs Innovations',
    };

    console.log('options is', options);

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
    const ipData = payload.ipData;
    const paymentMethod = payload.paymentMethod;

    let classesSold;
    if (body.classesSold && body.classesSold > 0) {
      classesSold = body.classesSold;
    } else {
      classesSold = body.level === 1 || body.level === 2 ? 12 : 24;
    }

    console.log('body hre is=');
    const batch = {
      ageGroup: body.ageGroup,
      batchType: body.batchType,
      classCount: classesSold,
      courseId: body.courseId,
      level: body.level,
      price: parseInt(body.discountedPrice || body.price),
    };

    const offeringBody = generateOffering(batch);
    body.offeringData = offeringBody;

    // console.log("getting token", token)

    console.log('paymentMethod', paymentMethod);

    if (paymentMethod === 'tazapay') {
      console.log('tpBody', body);

      yield payOnTazapay({body, ipData});
      return;
    }

    const token = yield auth().currentUser.getIdToken();
    const url =
      'https://5963-2401-4900-1c5c-3da3-d51-cedb-e809-a72b.ngrok-free.app';
    console.log('calling api');
    const response = yield fetch(`${BASE_URL}/shop/orderhandler/makepayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    });

    // console.log('res is', response.status);

    const data = yield response.json();

    console.log('order data=', data);

    if (response.status === 403) {
      // yield put(setLoading(false));
      console.log('errror happeded here');
      return;
    }

    console.log('i am here finnaly', data);
    const {amount, id: order_id, currency} = data.order;

    const orderResp = yield fetch(`${BASE_URL}/shop/orderhandler/addToBag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bagDetails: {...body, rpOrderId: order_id, type: 'order'},
        leadId: body?.leadId,
      }),
    });

    const orderRes = yield orderResp.json();
    console.log('i am here 2');

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

    console.log('i am her 3');

    const options = {
      key: 'rzp_test_0cYlLVRMEaCUDx',
      currency,
      amount: amount?.toString(),
      order_id,
      name: 'Younglabs',
      description: 'Younglabs Innovations',
    };

    console.log('options=', options);

    const rzRes = yield RazorpayCheckout.open(options);
    console.log('rzRes=', rzRes);
  } catch (error) {
    console.log('getting err', error.message);
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
