import {BASE_URL} from '@env';

export const getCourseDetails = async ({courseId, courseType, country}) => {
  return fetch(`${BASE_URL}/admin/courses/getCourseDetailsNew`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({courseId, country}),
  });
};

export const getClasses = async ({leadId, serviceRequestId, token}) => {
  const body = {
    leadId,
    serviceRequestId,
  };
  console.log('body:', body, token);
  return fetch(`${BASE_URL}/app/mycourses/serviceRequestClasses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  });
};
