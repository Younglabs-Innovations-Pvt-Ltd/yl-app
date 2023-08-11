import {BOOKING_URL, MARK_ATTENDENCE_URL, BOOKING_DETAILS} from '@env';

export const fetchBookingDetils = async data => {
  const body = data.phone
    ? JSON.stringify({phone: data.phone})
    : JSON.stringify({bookingId: data.bookingId});

  return await fetch(BOOKING_DETAILS, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: body,
  });
};

export const fetchBookingDetailsFromPhone = async phone => {
  return await fetch(BOOKING_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({phone: parseInt(phone), source: 'app'}),
  });
};

export const fetchBookingDetailsFromBookingId = async bookingId => {
  return await fetch(BOOKING_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({bId: bookingId, source: 'app'}),
  });
};

export const markattendence = async () => {
  const response = await fetch(MARK_ATTENDENCE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'student',
      bId: JSON.parse(demoBookingId),
    }),
  });
};
