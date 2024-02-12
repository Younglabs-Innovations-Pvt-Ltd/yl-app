import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import Icon from './icon.component';
import {COLORS} from '../utils/constants/colors';
import Modal from './modal.component';
import TextWrapper from './text-wrapper.component';
import {FONTS} from '../utils/constants/fonts';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';

const {height: deviceHeight} = Dimensions.get('window');

const isFileExists = async uri => {
  const videoName = uri.split('&token=')[1];
  const filePath = ReactNativeBlobUtil.fs.dirs.DownloadDir + videoName + '.mp4';
  const isExists = await RNFS.exists(filePath);
  return {isExists, filePath, videoName};
};

const VideoPlayer = ({
  uri,
  poster,
  thumbnailText,
  width = 135,
  aspectRatio,
}) => {
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentVideo = useRef();

  const onOpen = async () => {
    try {
      const result = await isFileExists(uri);

      if (result.isExists) {
        currentVideo.current = result.filePath;
      } else {
        currentVideo.current = uri;
      }

      setVisible(true);

      !result.isExists && checkForLocal(currentVideo.current);
    } catch (error) {
      currentVideo.current = uri;
      console.log(error);
    }
  };

  const onClose = () => {
    setVisible(false);
  };

  const onMute = () => {
    setMuted(!muted);
  };

  const onBack = () => {
    setVisible(false);
  };

  const checkForLocal = async uri => {
    try {
      const result = await isFileExists(uri);
      if (!result.isExists) {
        await ReactNativeBlobUtil.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            mediaScannable: true,
            // notification: true,
            title: result.videoName,
            path:
              ReactNativeBlobUtil.fs.dirs.DownloadDir +
              result.videoName +
              '.mp4',
            mime: 'application/video',
          },
        }).fetch('GET', uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLoadStart = () => {
    setLoading(true);
  };

  const onReadyForDisplay = () => {
    setLoading(false);
  };

  return (
    <>
      <Pressable
        style={[styles.container, {width: width, aspectRatio}]}
        onPress={onOpen}
        disabled={!poster}>
        <Image
          source={{uri: poster}}
          resizeMode="cover"
          style={{width: '100%', height: '100%'}}
        />
        {thumbnailText && (
          <View style={styles.poster}>
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 16,
              }}>
              <TextWrapper
                fs={20}
                ff={FONTS.signika_semiBold}
                color={COLORS.white}>
                {thumbnailText}
              </TextWrapper>
            </View>
          </View>
        )}
      </Pressable>
      <Modal visible={visible} transparent={false} onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          {loading && (
            <ActivityIndicator
              size={'large'}
              color={COLORS.white}
              style={styles.activityIndicator}
            />
          )}
          <Video
            source={{uri: currentVideo.current}}
            style={{width: '100%', height: '100%', alignSelf: 'center'}}
            muted={muted}
            resizeMode="contain"
            onLoadStart={onLoadStart}
            onReadyForDisplay={onReadyForDisplay}
          />
          <View style={styles.videoOverlay}>
            <View
              style={{
                position: 'relative',
                flex: 1,
              }}>
              <Icon
                name={'arrow-back-outline'}
                size={28}
                color={COLORS.white}
                style={{marginTop: 16, marginLeft: 16}}
                onPress={onBack}
              />
              <Icon
                name={muted ? 'volume-mute-outline' : 'volume-high-outline'}
                size={28}
                color={COLORS.white}
                style={{position: 'absolute', right: 24, bottom: 24}}
                onPress={onMute}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(VideoPlayer);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.black,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  activityIndicator: {
    alignSelf: 'center',
    top: deviceHeight * 0.5,
    position: 'absolute',
  },
});
