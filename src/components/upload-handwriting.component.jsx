import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
  Alert,
  Linking,
} from 'react-native';
import Storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import TextWrapper from './text-wrapper.component';
import {COLORS} from '../utils/constants/colors';
import Icon from './icon.component';
import Spacer from './spacer.component';
import ModalComponent from './modal.component';
import Snackbar from 'react-native-snackbar';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {saveHandwritingSample} from '../utils/api/yl.api';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {request, PERMISSIONS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {uploadSelector} from '../store/upload-handwriting/selector';
import {setSelectedImage} from '../store/upload-handwriting/reducer';
import {FONTS} from '../utils/constants/fonts';
import Email from './email.component';

const {width: deviceWidth} = Dimensions.get('window');

const UploadHandwriting = ({demoData}) => {
  const [loading, setLoading] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);

  const {selectedImage, modalVisible} = useSelector(uploadSelector);
  const dispatch = useDispatch();

  const pickFile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.3,
      });
      dispatch(setSelectedImage({image: result.assets[0], modal: true}));
    } catch (error) {
      console.log(error);
    }
  };

  const requestPermissions = async () => {
    return await request(PERMISSIONS.ANDROID.CAMERA);
  };

  const openAppSetting = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.log('OPEN_SETTING_ERROR=', error);
    }
  };

  const pickCamera = async () => {
    try {
      const result = await requestPermissions();
      console.log('result', result);
      if (result === 'denied') {
        Alert.alert(
          'Permission required',
          'To be able to upload image, please grant permission.',
          [
            {
              text: 'OK',
              onPress: () => requestPermissions(),
            },
          ],
        );
      } else if (result === 'blocked') {
        Snackbar.show({
          text: 'Notification permission blocked, go to app setting to grant it.',
          textColor: COLORS.white,
          duration: Snackbar.LENGTH_LONG,
          action: {
            text: 'GRANT',
            textColor: COLORS.white,
            onPress: openAppSetting,
          },
        });
      } else {
        const data = await launchCamera({
          cameraType: 'back',
          quality: 0.15,
          mediaType: 'photo',
        });
        dispatch(setSelectedImage({image: data.assets[0], modal: true}));
      }
    } catch (error) {
      console.log('launchCameraError', error.message);
    }
  };

  // useEffect(() => {
  //   if (selectedImage) {
  //     setVisible(true);
  //     setVisibleOptions(false);
  //   }
  // }, [selectedImage]);

  const uploadHandwritingImage = async () => {
    try {
      setLoading(true);
      const base64 = await RNFS.readFile(selectedImage.uri, 'base64');
      const fileUri = `data:${selectedImage.type};base64,${base64}`;

      const storageRef = Storage().ref(
        '/app/handwritingSamples/' + selectedImage.fileName,
      );
      const task = storageRef.putString(fileUri, 'data_url');
      //   setFileLoading(true);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });

      task.then(async () => {
        const downloadUrl = await storageRef.getDownloadURL();
        console.log(downloadUrl);
        const res = await saveHandwritingSample({
          bookingId: demoData?.bookingId,
          image: downloadUrl,
        });
        const data = await res.json();
        console.log('data', data);
        setLoading(false);
        // Alert.alert('Image uploaded successfully', '', [
        //   {
        //     text: 'OK',
        //     onPress: onClose,
        //   },
        // ]);

        Snackbar.show({
          text: 'Image uploaded',
          textColor: COLORS.white,
          duration: Snackbar.LENGTH_LONG,
        });

        setTimeout(() => {
          onClose();
        }, 1200);
      });
    } catch (error) {
      setLoading(false);
      console.log('UPLOAD_HANDWRITING_IMAGE_ERROR=', error);
    }
  };

  const onClose = () => {
    dispatch(setSelectedImage({image: null, modal: false}));
  };

  const onCloseOptions = () => {
    setVisibleOptions(false);
  };
  const onOpenOptions = () => {
    console.log('clicked..');
    setVisibleOptions(true);
  };

  const onVisibleEmail = () => {
    setVisibleEmail(true);
  };
  const onCloseEmail = () => {
    setVisibleEmail(false);
  };

  return (
    <View style={{paddingBottom: 20}}>
      <TextWrapper color={COLORS.white} fs={18}>
        Submit Handwriting Image
      </TextWrapper>
      <Spacer space={4} />
      <View style={{flexDirection: 'row', gap: 4}}>
        <Pressable
          onPress={onOpenOptions}
          style={({pressed}) => [
            styles.btnUpload,
            {opacity: pressed ? 0.9 : 1},
          ]}>
          <Icon name="camera" size={24} color={COLORS.black} />
          <TextWrapper color={COLORS.black} fs={18}>
            Select image
          </TextWrapper>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            styles.btnUpload,
            {opacity: pressed ? 0.9 : 1},
          ]}
          onPress={onVisibleEmail}>
          <TextWrapper color={COLORS.black} fs={18}>
            Get link on email
          </TextWrapper>
        </Pressable>
      </View>
      <ModalComponent
        visible={visibleOptions}
        onRequestClose={onCloseOptions}
        animationType="fade"
        duration={200}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.25)',
            justifyContent: 'flex-end',
            paddingHorizontal: 16,
            paddingBottom: 20,
          }}>
          <View style={styles.optionContainer}>
            <TextWrapper fs={20} styles={{textAlign: 'center'}}>
              Choose option
            </TextWrapper>
            <Spacer />
            <View
              style={{
                paddingTop: 12,
                paddingBottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View style={{alignItems: 'center'}}>
                <Pressable style={styles.icon} onPress={pickCamera}>
                  <Icon name="camera" size={36} color={COLORS.black} />
                </Pressable>
                <TextWrapper color={'gray'} styles={{marginTop: 4}}>
                  Camera
                </TextWrapper>
              </View>
              <View style={{alignItems: 'center'}}>
                <Pressable style={styles.icon} onPress={pickFile}>
                  <MIcon
                    name="image-size-select-actual"
                    size={32}
                    color={COLORS.black}
                  />
                </Pressable>
                <TextWrapper color={'gray'} styles={{marginTop: 4}}>
                  Select image
                </TextWrapper>
              </View>
            </View>
            <Spacer />
            <Pressable
              style={({pressed}) => [
                styles.btnCancel,
                {backgroundColor: pressed ? '#f5f5f5' : '#eee'},
              ]}
              onPress={onCloseOptions}>
              <TextWrapper color={COLORS.black}>Cancel</TextWrapper>
            </Pressable>
          </View>
        </View>
      </ModalComponent>
      <ModalComponent visible={modalVisible} onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextWrapper fs={18} ff={FONTS.signika_medium}>
              Upload image
            </TextWrapper>
            <Icon
              name="close-outline"
              size={26}
              color={COLORS.black}
              style={{alignSelf: 'flex-end'}}
              onPress={onClose}
            />
          </View>
          <Spacer />
          <View
            style={{
              flex: 1,
              paddingTop: deviceWidth * 0.2,
            }}>
            <View style={{alignItems: 'center'}}>
              <Pressable
                onPress={pickFile}
                style={{
                  width: deviceWidth * 0.5,
                  aspectRatio: 9 / 16,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}>
                {selectedImage && (
                  <Image
                    source={{uri: selectedImage?.uri}}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                )}
              </Pressable>
            </View>
            <Spacer space={16} />
            <Pressable
              onPress={uploadHandwritingImage}
              style={({pressed}) => [
                styles.btnUpload,
                {
                  opacity: pressed ? 0.9 : 1,
                  backgroundColor: COLORS.pblue,
                  width: deviceWidth * 0.7,
                  alignSelf: 'center',
                },
              ]}
              disabled={loading}>
              <Icon name="cloud-upload" size={24} color={COLORS.white} />
              <TextWrapper color={COLORS.white} fs={18}>
                Upload
              </TextWrapper>
              {loading && (
                <ActivityIndicator size="small" color={COLORS.white} />
              )}
            </Pressable>
          </View>
        </View>
      </ModalComponent>
      <ModalComponent visible={visibleEmail}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.15)',
            paddingHorizontal: 16,
          }}>
          <View style={{flex: 1}}></View>
          <View style={styles.emailContainer}>
            <Email demoData={demoData} />
            <Icon
              name="close"
              size={26}
              color={COLORS.black}
              style={{
                position: 'absolute',
                top: 8,
                right: 12,
              }}
              onPress={onCloseEmail}
            />
          </View>
          <View style={{flex: 1}}></View>
        </View>
      </ModalComponent>
    </View>
  );
};

export default UploadHandwriting;

const styles = StyleSheet.create({
  btnUpload: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
  },
  optionContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  btnCancel: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    borderRadius: 24,
  },
  emailContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    minHeight: 180,
    justifyContent: 'center',
    position: 'relative',
  },
});
