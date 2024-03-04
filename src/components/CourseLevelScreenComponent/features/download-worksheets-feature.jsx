import ReactNativeBlobUtil from 'react-native-blob-util';
import {Showtoast} from '../../../utils/toast';
import FileViewer from 'react-native-file-viewer';

export const downloadWorksheet = async ({serviceReqClassesData}) => {
  const workSheetLink = serviceReqClassesData?.classes[0]?.worksheetLink
    ? serviceReqClassesData?.classes[0]?.worksheetLink
    : 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/courses%2FEng_Handwriting_5-7%2F8-10%2FLevel%201%2Fworksheets%2FEng_Handwriting_5-7?alt=media&token=79b8550b-fd18-49de-90df-1acf3d1877f9';
  try {
    const response = await ReactNativeBlobUtil.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: 'Worksheets',
        path: ReactNativeBlobUtil.fs.dirs.DownloadDir + 'Worksheets' + '.pdf',
        mime: 'application/pdf',
      },
    }).fetch('GET', workSheetLink);
    await FileViewer.open(response.path());
  } catch (error) {
    Showtoast({
      text: 'Worksheet not available',
      toast,
      type: 'error',
    });
  }
};
