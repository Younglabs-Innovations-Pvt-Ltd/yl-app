import React, {useRef, useState, useMemo} from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
  Alert,
  Linking,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import TextWrapper from './text-wrapper.component';
import Icon from './icon.component';
import Pdf from 'react-native-pdf';
import Spacer from './spacer.component';
import {COLORS} from '../utils/constants/colors';
import Modal from './modal.component';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {request, PERMISSIONS} from 'react-native-permissions';
import FileViewer from 'react-native-file-viewer';

const {width: deviceWidth} = Dimensions.get('window');

const worksheets = [
  {
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/worksheets%2FEnglish%20demo%20worksheets%20for%20app.pdf?alt=media&token=72fb6e92-7271-499f-84d7-8389a01b3eba',
    name: 'younglab-english-worksheet',
  },
  {
    uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/worksheets%2FHindi%20demo%20worksheets%20for%20app.pdf?alt=media&token=3c35d502-94a2-4eea-b30e-acf8600fd321',
    name: 'younglab-hindi-worksheet',
  },
];

const Worksheets = () => {
  const [openWorksheet, setOpenWorkSheet] = useState(false);
  const currentWorksheet = useRef();

  const onOpenWorksheet = item => {
    currentWorksheet.current = item.uri;
    setOpenWorkSheet(true);
  };

  const closeOpenWorksheet = () => {
    setOpenWorkSheet(false);
  };

  const requestPermission = async () => {
    return request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
  };

  const openAppSetting = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.log('OPEN_SETTING_ERROR=', error);
    }
  };

  const downloadWorksheet = async item => {
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        const response = await ReactNativeBlobUtil.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mediaScannable: true,
            title: item.name,
            path: ReactNativeBlobUtil.fs.dirs.DownloadDir + item.name + '.pdf',
            mime: 'application/pdf',
          },
        }).fetch('GET', item.uri);

        await FileViewer.open(response.path());
      } else if (result === 'denied') {
        Alert.alert(
          'Permission required',
          'To be able to download worksheets, please grant permission.',
          [
            {
              text: 'OK',
              onPress: () => downloadWorksheet(),
            },
          ],
        );
      } else if (result === 'blocked') {
        Alert.alert(
          'Permissions blocked',
          'Notification permission blocked, go to app setting to grant it.',
          [
            {
              text: 'OK',
              onPress: openAppSetting,
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const WORKSHEET = useMemo(() => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 8}}>
        {worksheets.map((item, index) => (
          <WorksheetItem
            key={item.uri.slice(0, Math.random() * item.uri.length)}
            item={item}
            index={index}
            onOpenWorksheet={onOpenWorksheet}
            downloadWorksheet={downloadWorksheet}
          />
        ))}
      </ScrollView>
    );
  }, [worksheets]);

  return (
    <View style={{paddingBottom: 16}}>
      <TextWrapper fs={20} fw="700">
        Start practicing today, download free worksheets
      </TextWrapper>
      <Spacer />
      {WORKSHEET}
      <Modal
        transparent={false}
        visible={openWorksheet}
        animationType="fade"
        onRequestClose={closeOpenWorksheet}>
        <View style={{flex: 1}}>
          <Pdf
            source={{
              uri: currentWorksheet.current,
              cache: true,
            }}
            style={{width: '100%', height: '100%'}}
            onError={err => console.log(err)}
            trustAllCerts={false}
            page={1}
            renderActivityIndicator={() => (
              <ActivityIndicator color={COLORS.black} size={'small'} />
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const WorksheetItem = ({item, index, onOpenWorksheet, downloadWorksheet}) => {
  return (
    <View style={styles.pdfContainer} key={index.toString()}>
      <Pdf
        source={{
          uri: item.uri,
          cache: true,
        }}
        style={{width: '100%', height: '100%'}}
        onError={err => console.log(err)}
        trustAllCerts={false}
        maxScale={1}
        page={1}
        scale={1}
        renderActivityIndicator={() => (
          <ActivityIndicator color={COLORS.black} size={'small'} />
        )}
      />
      <View style={styles.pdfOverlay}>
        <View
          style={{
            height: '100%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1, padding: 4}]}
            onPress={() => downloadWorksheet(item)}>
            <Icon
              name="cloud-download-outline"
              size={28}
              color={COLORS.white}
            />
          </Pressable>
          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1, padding: 4}]}
            onPress={() => onOpenWorksheet(item)}>
            <Icon name="open-outline" size={28} color={COLORS.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Worksheets;

const styles = StyleSheet.create({
  pdfContainer: {
    width: deviceWidth * 0.3,
    maxWidth: 140,
    height: 120,
    borderRadius: 6,
    overflow: 'hidden',
    pointerEvents: 'box-none',
    position: 'relative',
  },
  pdfOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
