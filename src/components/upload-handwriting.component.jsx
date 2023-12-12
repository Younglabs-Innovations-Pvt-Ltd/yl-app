import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import TextWrapper from './text-wrapper.component';
import {COLORS} from '../utils/constants/colors';
import Icon from './icon.component';
import Spacer from './spacer.component';
import ModalComponent from './modal.component';
import Snackbar from 'react-native-snackbar';
import {launchImageLibrary} from 'react-native-image-picker';
import {saveHandwritingSample} from '../utils/api/yl.api';

const {width: deviceWidth} = Dimensions.get('window');

const UploadHandwriting = ({demoData}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.4,
      });
      setSelectedImage(result.assets[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      setVisible(true);
    }
  }, [selectedImage]);

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
        Snackbar.show({
          text: 'Image uploaded.',
          textColor: COLORS.white,
          duration: Snackbar.LENGTH_SHORT,
        });
      });
    } catch (error) {
      setLoading(false);
      console.log('UPLOAD_HANDWRITING_IMAGE_ERROR=', error);
    }
  };

  const onClose = () => {
    setSelectedImage(null);
    setVisible(false);
  };

  return (
    <View>
      <TextWrapper color={COLORS.white}>
        Upload your child's handwriting image
      </TextWrapper>
      <Spacer space={4} />
      <Pressable
        onPress={pickFile}
        style={({pressed}) => [styles.btnUpload, {opacity: pressed ? 0.9 : 1}]}>
        <Icon name="camera" size={24} color={COLORS.black} />
        <TextWrapper color={COLORS.black} fs={18}>
          Select image
        </TextWrapper>
      </Pressable>
      <ModalComponent visible={visible} onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <Icon
            name="close-outline"
            size={26}
            color={COLORS.black}
            style={{alignSelf: 'flex-end'}}
            onPress={onClose}
          />
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
                <Image
                  source={{uri: selectedImage?.uri}}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
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
    </View>
  );
};

export default UploadHandwriting;

const styles = StyleSheet.create({
  btnUpload: {
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
});
