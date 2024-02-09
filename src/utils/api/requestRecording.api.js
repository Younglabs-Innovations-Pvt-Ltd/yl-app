import {BASE_URL} from '@env';

export const requestRecording = async ({leadId, classId, token}) => {
  return fetch(`${BASE_URL}/app/mycourse/requestRecording`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({leadId, classId}),
  });
};
