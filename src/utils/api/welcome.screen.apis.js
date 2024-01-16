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
