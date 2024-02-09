import RNFS from 'react-native-fs';
import Storage from '@react-native-firebase/storage';
import {BASE_URL} from '@env';

const sendHwLink = async ({leadId, classId, homeworkUrls, token}) => {
  const body = {
    leadId,
    classId,
    homeworkUrls,
  };
  console.log('calling api to save the urls in classes');
  return fetch(`${BASE_URL}/app/mycourse/savehomework`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  });
};

const uploadHomeWorkImage = async ({
  path,
  images,
  classId,
  leadId,
  token,
  serviceRequestId,
}) => {
  try {
    const uploadTasks = images.map(async (image, index) => {
      const base64 = await RNFS.readFile(image.uri, 'base64');
      const fileUri = `data:${image.type};base64,${base64}`;
      const extension = image.type.split('/')[1];
      const storageRef = Storage().ref(`${path}/${index}.${extension}`);
      const task = storageRef.putString(fileUri, 'data_url');

      return new Promise((resolve, reject) => {
        task.on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });

        task
          .then(async () => {
            const downloadUrl = await storageRef.getDownloadURL();
            console.log('check all url', downloadUrl);
            resolve(downloadUrl);
          })
          .catch(error => {
            reject(error);
          });
      });
    });

    const imagesUrls = await Promise.all(uploadTasks);

    const response = await sendHwLink({
      leadId,
      classId,
      homeworkUrls: imagesUrls,
      token,
    });

    if (response.status === 200) {
      console.log('home work submitted successfully');
      return response;
    }
  } catch (error) {
    console.log('UPLOAD_HOMEWORK_IMAGE_ERROR=', error);
  }
};

export const submitHomeWork = async ({
  classId,
  homeworkUrls,
  leadId,
  allImages,
  token,
  serviceRequestId,
}) => {
  const path = `accounts/${leadId}/classes/${classId}/homework`;
  return uploadHomeWorkImage({
    path,
    images: allImages,
    token,
    classId,
    leadId,
    serviceRequestId,
  });
};
