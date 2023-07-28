const BOOKING_URL =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/demobook/bookingstatus';

const MARK_ATTENDENCE_URL =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/demobook/markattendance';

const BOOKING_DETAILS =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/bookings/getBooking';

export const fetchBookingDetils = async phone => {
  return await fetch(BOOKING_DETAILS, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({phone}),
  });
};

export const fetchBookingDetailsFromPhone = async phone => {
  return await fetch(BOOKING_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({phone: parseInt(phone)}),
  });
};

export const fetchBookingDetailsFromBookingId = async bookingId => {
  return await fetch(BOOKING_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({bId: bookingId}),
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
