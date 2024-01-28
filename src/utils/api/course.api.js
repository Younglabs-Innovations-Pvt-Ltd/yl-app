import {BASE_URL} from '@env';

export const getCourseDetails = async ({courseId, courseType, country}) => {
  const url =
    'https://3671-2401-4900-1c5a-92a0-4868-58de-b7f8-1ce8.ngrok-free.app';
  return fetch(`${url}/admin/courses/getCourseDetailsNew`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({courseId, courseType, country}),
  });
};
