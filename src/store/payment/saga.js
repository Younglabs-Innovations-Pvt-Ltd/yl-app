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
import {useEffect} from 'react';
import {startFetchingIpData} from '../book-demo/book-demo.reducer';
import {err} from 'react-native-svg';

// useEffect(() => {
//   if (!ipData) {
//     dispatch(startFetchingIpData());
//   }
// }, [ipData]);

// const BASE_URL =
//   'https://ab9e-2401-4900-1f39-499e-170-a19-6bdb-716d.ngrok-free.app';

// function* payOnTazapay({ipData, email, authToken, phone, fullName, toPay}) {
//   try {
//     console.log('in tazapay');
//     const url =
//       'https://ccc4-2401-4900-1c5b-8195-d1cb-a442-478b-1655.ngrok-free.app';
//     const response = yield fetch(`${url}/payments/tp/createCheckoutsession`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + authToken,
//       },
//       body: JSON.stringify({
//         buyer: {
//           email: email,
//           contact_code: ipData.calling_code,
//           contact_number: phone,
//           country: ipData.country_code2,
//           ind_bus_type: 'Individual',
//           business_name: 'Younglabs Innovations',
//           first_name: fullName,
//           last_name: 'test',
//         },
//         fee_paid_by: 'buyer',
//         fee_percentage: 100,
//         invoice_currency: ipData.currency.code,
//         invoice_amount: toPay,
//         txn_description: '',
//         callback_url: 'https://www.younglabs.in/paymentSuccess',
//         complete_url: 'https://www.younglabs.in/paymentSuccess',
//         error_url: 'https://google.com',
//       }),
//     });
//     console.log('got res');

//     const data = yield response.json();
//     console.log('got res', data);
//     const token = data.body.data.token;
//     const txn_no = data.body.data.txn_no;

//     console.log('we get token', token);
//   } catch (error) {
//     console.log('error in tazapay', error.message);
//   }
// }

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
    console.log('got response');

    if (addToBagRes.status !== 200) {
      console.log('did not get response');
      return;
    }

    const {bagId} = yield addToBagRes.json();

    const currency = body.FCY.split(' ')[0];
    // getting checkOutSession token
    const createCheckoutSessionBody = {
      email: body.email,
      invoiceCurrency: 'QAR', //change with currency
      name: body.fullName,
      country: 'QA', //ipData.country_code2 change with country
      phone: body.phone,
      callingCode: body.countryCode,
      amount: body.price,
      bagId,
    };
    console.log('callingCheckOutSession with body', createCheckoutSessionBody);

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
    console.log('got checkOutSession res');

    if (checkOutSessionRes.status !== 200) {
      console.log('can not generate checkOutSession token');
      return;
    }

    const {token} = yield checkOutSessionRes.json();
    //
    console.log('token is', token);
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

    console.log('here 1', response);

    const data = yield response.json();

    console.log('here 2');

    // console.log('order data=', data);

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
      key: RP_KEY,
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

    console.log('body hre is=');
    const batch = {
      ageGroup: body.ageGroup,
      batchType: body.batchType,
      classCount: body.level === 1 || body.level === 2 ? 12 : 24,
      courseId: body.courseId,
      level: body.level,
      price: parseInt(body.discountedPrice || body.price),
    };

    const offeringBody = generateOffering(batch);

    body.offeringData = offeringBody;

    // console.log("getting token", token)

    if (paymentMethod === 'tazapay') {
      yield payOnTazapay({body, ipData});
      return;
    }

    const token = yield auth().currentUser.getIdToken();
    const response = yield fetch(`${BASE_URL}/shop/orderhandler/makepayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    });


    const data = yield response.json();

    console.log('order data=', data);

    if (response.status === 403) {
      // yield put(setLoading(false));
      console.log('errror happeded here');
      return;
    }

    console.log('i am here finnaly');
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
