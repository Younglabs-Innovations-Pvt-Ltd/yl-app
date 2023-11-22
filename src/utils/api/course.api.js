import {BASE_URL} from '@env';

export const getCourseDetails = async courseId => {
  return fetch(`${BASE_URL}/admin/courses/${courseId}`);
};
