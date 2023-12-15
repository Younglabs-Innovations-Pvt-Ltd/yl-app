import React, {useRef, useState, useMemo, useEffect} from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
  Alert,
  Linking,
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
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getAppWorksheets} from '../utils/api/yl.api';
import {FONTS} from '../utils/constants/fonts';

const Worksheets = ({handleSectionLayout}) => {
  const [openWorksheet, setOpenWorkSheet] = useState(false);
  const [worksheets, setWorkSheets] = useState([]);
  const [worksheetContent, setWorkSheetContent] = useState(null);
  const currentWorksheet = useRef();

  // App content
  useEffect(() => {
    const fetchAppWorksheets = async () => {
      try {
        const res = await getAppWorksheets();
        const {data, content} = await res.json();
        setWorkSheets(data);
        setWorkSheetContent(content);
      } catch (error) {
        console.log('FETCH_APP_TESTIMONIALS_ERROR', error.message);
      }
    };

    fetchAppWorksheets();
  }, []);

  const onOpenWorksheet = item => {
    currentWorksheet.current = item;
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
          'Permission blocked, go to app setting to grant it.',
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
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 2,
          paddingVertical: 8,
          maxHeight: 120,
        }}>
        {worksheets.reverse().map((item, index) => (
          <WorksheetItem
            key={item.id}
            item={item}
            onOpenWorksheet={onOpenWorksheet}
            downloadWorksheet={downloadWorksheet}
          />
        ))}
      </ScrollView>
    );
  }, [worksheets]);

  return (
    <View
      style={{paddingBottom: 16}}
      onLayout={event => handleSectionLayout('worksheets', event)}>
      <TextWrapper fs={21} ff={FONTS.signika_semiBold} color="#434a52" fw="600">
        {worksheetContent?.heading}
      </TextWrapper>
      <TextWrapper
        fs={20}
        ff={FONTS.dancing_script}
        color="#434a52"
        styles={{lineHeight: 22}}>
        {worksheetContent?.subheading}
      </TextWrapper>
      <Spacer />
      {WORKSHEET}
      <Modal
        transparent={false}
        visible={openWorksheet}
        animationType="fade"
        onRequestClose={closeOpenWorksheet}>
        <View style={{flex: 1, position: 'relative'}}>
          <Pdf
            source={{
              uri: currentWorksheet.current?.uri,
              cache: true,
            }}
            style={{width: '100%', height: '100%'}}
            onError={err => console.log(err)}
            trustAllCerts={false}
            page={1}
            renderActivityIndicator={() => (
              <ActivityIndicator color={COLORS.black} size={'large'} />
            )}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              paddingHorizontal: 12,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Pressable
              style={({pressed}) => [{opacity: pressed ? 0.8 : 1, padding: 4}]}
              onPress={closeOpenWorksheet}>
              <Icon name="arrow-back-outline" size={28} color={COLORS.black} />
            </Pressable>
            <Pressable
              style={({pressed}) => [{opacity: pressed ? 0.8 : 1, padding: 4}]}
              onPress={() => downloadWorksheet(currentWorksheet.current)}>
              <Icon
                name="cloud-download-outline"
                size={28}
                color={COLORS.black}
              />
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const WorksheetItem = ({item, index, onOpenWorksheet, downloadWorksheet}) => {
  return (
    <Pressable
      style={styles.pdfContainer}
      onPress={() => onOpenWorksheet(item)}>
      {/* <Pdf
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
      /> */}

      {/* <View style={{width: 58, height: 58, marginBottom: 4}}>
        <Image style={styles.icon} source={WorksheetIcon} />
      </View> */}
      <View
        style={{
          height: '70%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MIcon name="file-document-multiple" size={48} color={'#76c8f2'} />
      </View>
      <View style={{height: '30%'}}>
        <TextWrapper
          fs={15}
          styles={{textTransform: 'capitalize', textAlign: 'center'}}>
          {item.title}
        </TextWrapper>
      </View>

      {/* <View style={styles.pdfOverlay}>
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
      </View> */}
    </Pressable>
  );
};

export default Worksheets;

const styles = StyleSheet.create({
  pdfContainer: {
    width: 110,
    // height: 110,
    // borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    // padding: 8,
    backgroundColor: '#fff',
    elevation: 4,
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
  icon: {
    width: '100%',
    height: '100%',
  },
});
