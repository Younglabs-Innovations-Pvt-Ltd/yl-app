import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import TextWrapper from '../components/text-wrapper.component';
import Icon from '../components/icon.component';
import {COLORS} from '../utils/constants/colors';
import DocumentPicker, {types} from 'react-native-document-picker';
import Spacer from '../components/spacer.component';

import Storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../utils/constants/local-keys';
import {checkBookingStatus} from '../utils/api/yl.api';
// import {Image} from "react-native-compressor"

import {joinDemoSelector} from '../store/join-demo/join-demo.selector';

const pdfURI = 'http://samples.leanpub.com/thereactnativebook-sample.pdf';

const image1 =
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D';
const image2 =
  'https://media.istockphoto.com/id/1410336911/photo/back-view-of-little-girl-attending-a-class-in-elementary-school.webp?b=1&s=170667a&w=0&k=20&c=ZX4SkJF68Ohe3dV2fxZQgKhf8fud1lnpxXWamS1EwFc=';
const image3 =
  'https://media.istockphoto.com/id/1402788196/photo/smiling-teacher-and-little-child-talking-and-playing-at-preschool.webp?b=1&s=170667a&w=0&k=20&c=8lvYGQ1mv6p4rfS3uoPkj6O_GDlGeFnhDzYzWe3x6ck=';

function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    checkBooking();
  }, []);

  useEffect(() => {
    const openPDF = async () => {
      const extension = getUrlExtension(pdfURI);

      // Feel free to change main path according to your requirements.
      const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;
      console.log('localFile=', localFile);

      const options = {
        fromUrl: pdfURI,
        toFile: localFile,
      };

      RNFS.downloadFile(options)
        .promise.then(() => {})
        .then(res => {
          // success
          console.log('success');
        })
        .catch(error => {
          // error
          console.log('err=', error);
        });
    };

    // openPDF();
  }, []);

  const checkBooking = async () => {
    try {
      const phone =
        (await AsyncStorage.getItem(LOCAL_KEYS.PHONE)) || 7983333333;
      const response = await checkBookingStatus(phone);

      if (response.status === 200) {
        const data = await response.json();
        setBooking(data);
      }
    } catch (error) {
      console.log('CHECK_BOOKING_ERROR=', error);
    }
  };

  const pickFile = async () => {
    await DocumentPicker.pick({
      type: [types.images],
    })
      .then(result => setSelectedImage(result[0]))
      .catch(err => console.log(err));
  };

  const closeImage = () => setSelectedImage(null);

  const uploadHandwritingImage = async () => {
    try {
      const base64 = await RNFS.readFile(selectedImage.uri, 'base64');
      const fileUri = `data:${selectedImage.type};base64,${base64}`;

      const storageRef = Storage().ref(
        '/app/handwritingSamples/' + selectedImage.name,
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
        // const messageRef = database().ref('/messages/' + Date.now());
        // await messageRef.set({
        //   id: Date.now(),
        //   type: file.type,
        //   url: downloadUrl,
        //   username,
        // });
        // setFileLoading(false);
      });
    } catch (error) {
      console.log('UPLOAD_HANDWRITING_IMAGE_ERROR=', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bouncesZoom={false}
      contentContainerStyle={{
        paddingTop: 16,
        paddingHorizontal: 8,
        paddingBottom: StatusBar.currentHeight * 0.6,
      }}>
      <View style={{maxWidth: 378, alignSelf: 'center'}}>
        {/* Upload Image */}
        <View>
          <TextWrapper fs={18}>
            Take picture of your child's english handwriting and upload.
          </TextWrapper>
          <Pressable
            style={({pressed}) => [
              styles.cameraView,
              {
                opacity: pressed ? 0.8 : 1,
                justifyContent: selectedImage ? 'flex-start' : 'center',
              },
            ]}
            onPress={pickFile}>
            {!selectedImage ? (
              <Icon
                name="camera"
                size={64}
                color={COLORS.black}
                style={{alignSelf: 'center'}}
              />
            ) : (
              <Image style={styles.hImage} source={{uri: selectedImage?.uri}} />
            )}

            {selectedImage && (
              <Pressable style={styles.btnClose} onPress={closeImage}>
                <Icon name="close-outline" size={28} color={COLORS.black} />
              </Pressable>
            )}

            {selectedImage && (
              <Pressable
                style={styles.btnUpload}
                onPress={uploadHandwritingImage}>
                <Icon
                  name="cloud-upload-outline"
                  size={24}
                  color={COLORS.black}
                />
                <TextWrapper>Upload</TextWrapper>
              </Pressable>
            )}
          </Pressable>
        </View>

        {/* Feature Section*/}
        <View style={styles.improvements}>
          <View style={styles.improvementItem}>
            <TextWrapper fs={24}>Heading 1</TextWrapper>
            <Spacer space={4} />
            <TextWrapper>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea quis
              veniam expedita minus, animi dolorem eveniet deserunt totam
              similique, reiciendis at? Officiis voluptatum tempore tempora
              alias perferendis ducimus odio eos!
            </TextWrapper>
            <Spacer space={8} />
            <Image
              style={{width: '100%', height: 200, borderRadius: 4}}
              source={{uri: image1}}
            />
          </View>
          <View style={styles.improvementItem}>
            <TextWrapper fs={24}>Heading 2</TextWrapper>
            <Spacer space={4} />
            <TextWrapper>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea quis
              veniam expedita minus, animi dolorem eveniet deserunt totam
              similique, reiciendis at? Officiis voluptatum tempore tempora
              alias perferendis ducimus odio eos!
            </TextWrapper>
            <Spacer space={8} />
            <Image
              style={{width: '100%', height: 200, borderRadius: 4}}
              source={{uri: image2}}
            />
          </View>
          <View style={styles.improvementItem}>
            <TextWrapper fs={24}>Heading 3</TextWrapper>
            <Spacer space={4} />
            <TextWrapper>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea quis
              veniam expedita minus, animi dolorem eveniet deserunt totam
              similique, reiciendis at? Officiis voluptatum tempore tempora
              alias perferendis ducimus odio eos!
            </TextWrapper>
            <Spacer space={8} />
            <Image
              style={{width: '100%', height: 200, borderRadius: 4}}
              source={{uri: image3}}
            />
          </View>
        </View>

        <View style={styles.worksheetContainer}>
          <TextWrapper fs={22}>Worksheets</TextWrapper>
          <TextWrapper>
            Download worksheets for practice before the class.
          </TextWrapper>
          <View style={styles.worksheets}>
            <View style={styles.worksheet}></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 540,
    alignSelf: 'center',
  },
  cameraView: {
    height: 180,
    backgroundColor: '#eaeaea',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  hImage: {
    width: '100%',
    height: 180,
    objectFit: 'contain',
  },
  btnClose: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  btnUpload: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  improvements: {
    paddingTop: 12,
  },
  improvementItem: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  pdf: {
    flex: 1,
  },
  worksheet: {
    height: 140,
  },
  worksheets: {
    flexDirection: 'row',
    gap: 4,
  },
});
