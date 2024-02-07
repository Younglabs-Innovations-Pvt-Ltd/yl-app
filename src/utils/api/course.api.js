import {BASE_URL} from '@env';

export const getCourseDetails = async courseId => {
  return fetch(`${BASE_URL}/admin/courses/${courseId}`);
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
