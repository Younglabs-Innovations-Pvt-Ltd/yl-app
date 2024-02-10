import {BASE_URL} from '@env';

const SOURCE = 'app';

export const fetchCoursesForWelcomeScreen = async country => {
  return await fetch(
    `${BASE_URL}/admin/courses/getCoursesForLandingPage/${country}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const fetchAllBookinsFromPhone = async phone => {
  return await fetch(`${BASE_URL}/admin/demobook/getBookingsByChild`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({phone}),
  });
};

export const fetchAllOrdersFromLeadId = async payload => {
  return await fetch(`${BASE_URL}/app/mycourses/orderrequests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + payload.token,
    },
    body: JSON.stringify({leadId: payload?.leadId}),
  });
};
