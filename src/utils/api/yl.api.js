import {
  BASE_URL,
  BOOKING_URL,
  MARK_ATTENDENCE_URL,
  BOOKING_DETAILS,
  ADD_BOOKINGS_API,
  UPDATE_CHILD_NAME,
  ACS_TOKEN_URL,
  RATING_API,
  MARK_MORE_INFO_API,
  DEVICE_ID_URL,
  CREATE_LEAD,
} from '@env';

const SOURCE = 'app';

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param data all the information related to booking coming from BookDemoSlots Screen
 * @description Make new booking
 */
export const makeNewBooking = async data => {
  return await fetch(`${BASE_URL}${ADD_BOOKINGS_API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param data an object with phone or booking id
 * @description Fetch booking details against booking
 */
export const fetchBookingDetils = async data => {
  const body = data.phone
    ? JSON.stringify({phone: data.phone})
    : JSON.stringify({bookingId: data.bookingId});

  return await fetch(`${BASE_URL}${BOOKING_DETAILS}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: body,
  });
};

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param phone
 * @description Fetch booking status by phone number
 */
export const fetchBookingDetailsFromPhone = async (phone, deviceId) => {
  let body = deviceId
    ? JSON.stringify({phone: parseInt(phone), source: SOURCE, deviceId})
    : JSON.stringify({phone: parseInt(phone), source: SOURCE});

  return await fetch(`${BASE_URL}${BOOKING_URL}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: body,
  });
};

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param bookingId booking id of demo class
 * @description Fetch booking details by phone number
 */
export const fetchBookingDetailsFromBookingId = async (bookingId, deviceId) => {
  console.log('booking id is', bookingId);

  return await fetch(`${BASE_URL}${BOOKING_URL}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({bId: bookingId, source: SOURCE, deviceId}),
  });
};

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param bookingId booking id of demo class
 * @description Mark attendance of a user
 */
export const markAttendance = async ({bookingId}) => {
  return await fetch(`${BASE_URL}${MARK_ATTENDENCE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'student',
      bId: bookingId,
      source: SOURCE,
    }),
  });
};

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param bookingDetails Contains bookingid and all booking related info
 * @param childName child name
 * @description Update child name
 */
export const updateChildName = async ({bookingDetails, childName}) => {
  return await fetch(`${BASE_URL}${UPDATE_CHILD_NAME}`, {
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

/**
 * @author Shobhit
 * @since 20/09/2023
 * @description
 * Get Azure Communication Token(acs)
 * To join class
 */
export const getAcsToken = async () => {
  return await fetch(`${BASE_URL}${ACS_TOKEN_URL}`, {
    method: 'GET',
  });
};

// Save rating
export const saveFreeClassRating = async ({bookingId, rating}) => {
  return await fetch(`${BASE_URL}${RATING_API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bookingId,
      rating,
    }),
  });
};

// Mark need more info by booking id
export const saveNeedMoreInfo = async ({bookingId}) => {
  return await fetch(`${BASE_URL}${MARK_MORE_INFO_API}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      bookingId: bookingId,
      source: SOURCE,
    }),
  });
};

// Store every device id to database
export const storeDeviceId = async ({deviceId, phone, deviceUID}) => {
  return fetch(`${BASE_URL}${DEVICE_ID_URL}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({deviceId, phone, deviceUID}),
  });
};

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param phone
 * @description Fetch booking status by phone number
 */
export const checkBookingStatus = async phone => {
  return await fetch(`${BASE_URL}${BOOKING_URL}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({phone}),
  });
};

// Get lead email
export const getLeadEmail = async leadId => {
  return await fetch(`${BASE_URL}/admin/demobook/getLeadEmail`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({leadId}),
  });
};

// Mark not interested in
export const markNotInterest = async ({bookingId, comment}) => {
  return await fetch(`${BASE_URL}/admin/demobook/markNotInterested`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({bookingId, comment}),
  });
};

// Get available coupon codes
export const getOfferCode = async ({phone}) => {
  return await fetch(`${BASE_URL}/offers/activeAppOffers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({phone}),
  });
};

// Check for customer
export const getCustomers = async body => {
  return await fetch(`${BASE_URL}/admin/customers/checkCustomer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

// Save handwriting sample
export const saveHandwritingSample = async ({bookingId, image}) => {
  return await fetch(`${BASE_URL}/admin/demobook/uploadHandwritigSample`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({bookingId, image}),
  });
};

// Get app content
export const getAppTestimonials = async () => {
  // return await fetch(`${BASE_URL}/app/content/getAppTestimonials`, {
  return await fetch(
    `https://younglabsapis-33heck6yza-el.a.run.app/app/content/getAppTestimonials`,
    {
      method: 'GET',
    },
  );
};

// Get app worksheets
export const getAppWorksheets = async () => {
  return await fetch(`${BASE_URL}/app/content/getAppWorksheets`, {
    method: 'GET',
  });
};

// Get course video
export const getCourseVideo = async ({courseId}) => {
  return await fetch(`${BASE_URL}/app/content/getCourseResources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({courseId}),
  });
};

// Create lead
export const createLead = async body => {
  return fetch(`${BASE_URL}${CREATE_LEAD}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

// console.log('BASE_URL', BASE_URL);

export const addNewSoloBooking = async data => {
  // console.log("calling api", data)
  return await fetch(`${BASE_URL}/admin/app/addSoloDemoBooking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
