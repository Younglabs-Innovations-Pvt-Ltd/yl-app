import {
  BOOKING_URL,
  MARK_ATTENDENCE_URL,
  BOOKING_DETAILS,
  ADD_BOOKINGS_API,
  UPDATE_CHILD_NAME,
  ACS_TOKEN_URL,
} from '@env';

// Make new booking
export const makeNewBooking = async data => {
  return await fetch(ADD_BOOKINGS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// Fetch booking details
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

// Demo class details via phone
export const fetchBookingDetailsFromPhone = async phone => {
  return await fetch(BOOKING_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({phone: parseInt(phone), source: 'app'}),
  });
};

// Demo class details via booking id
export const fetchBookingDetailsFromBookingId = async bookingId => {
  return await fetch(BOOKING_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({bId: bookingId, source: 'app'}),
  });
};

// mark attendance
export const markAttendance = async ({bookingId}) => {
  return await fetch(MARK_ATTENDENCE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'student',
      bId: bookingId,
      source: 'app',
    }),
  });
};

// update child name
export const updateChildName = async ({bookingDetails, childName}) => {
  return await fetch(UPDATE_CHILD_NAME, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bId: bookingDetails.bookingId,
      cN: childName,
    }),
  });
};

// Get acs token
export const getAcsToken = async () => {
  return await fetch(ACS_TOKEN_URL, {
    method: 'GET',
  });
};
