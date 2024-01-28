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
