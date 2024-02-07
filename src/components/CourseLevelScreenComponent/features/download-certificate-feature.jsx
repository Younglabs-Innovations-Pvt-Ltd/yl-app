import {BASE_URL} from '@env';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export const downloadCertificate = async ({
  course,
  serviceRequestId,
  leadId,
}) => {
  const token = await auth().currentUser.getIdToken();
  const API_URL = `${BASE_URL}/app/myaccount/generate-certificate`;
  const courseName = 'Hindi Handwriting';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        leadId,
        name: 'himanshu',
        courseName,
        serviceRequestId,
      }),
    });

    console.log(response);

    if (response.status === 200) {
      const blob = await response.blob();

      // Write blob data to a file
      const filePath = RNFS.DocumentDirectoryPath + '/certificate.pdf';
      await RNFS.writeFile(filePath, blob);

      const fileUri = 'file://' + filePath;

      // Now you can use fileUri as needed
      console.log('Certificate URI:', fileUri);
      const options = {
        type: 'application/pdf',
        url: fileUri,
        showAppsToView: true,
      };

      await Share.open(options);

      // Additional code for handling the downloaded file, e.g., open it, etc.
    } else {
      console.log('Certificate can be downloaded after the course is over');
    }
  } catch (error) {
    console.error('Error downloading certificate:', error);
  }
};

// export const downloadCertificate = async ({
//   course,
//   serviceRequestId,
//   leadId,
// }) => {
//   const token = await auth().currentUser.getIdToken();
//   const API_URL = `${BASE_URL}/app/myaccount/generate-certificate`;
//   const courseName = 'Hindi Handwriting';
//   const response = await fetch(API_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer ' + token,
//     },
//     body: JSON.stringify({
//       leadId,
//       name: 'himanshu',
//       courseName,
//       serviceRequestId,
//     }),
//   });

//   console.log(response);

//   if (response.status === 200) {
//     const res = await response.blob();
//     console.log(res, 'check certificate res');
//     const url = window.URL.createObjectURL(blob);
//   } else {
//     console.log('Certificate can be downloaded after the course is over');
//   }
// };

// const DownloadCertificateFeature = () => {
//   return (
//     <View>
//       <Text className="text-black">DownloadCertificateFeature</Text>
//     </View>
//   );
// };

// export default DownloadCertificateFeature;
