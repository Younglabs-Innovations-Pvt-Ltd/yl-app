import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {COLORS} from '../utils/constants/colors';

const isFileExists = async uri => {
  const videoName = uri.split('&token=')[1];
  const filePath = ReactNativeBlobUtil.fs.dirs.DownloadDir + videoName + '.mp4';
  const isExists = await RNFS.exists(filePath);
  return {isExists, filePath, videoName};
};

const VideoMediaPlayer = ({uri, ...otherProps}) => {
  const [videoLoading, setVideoLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [localUri, setLocalUri] = useState('');
  const videoRef = useRef(null);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // do something
      setPaused(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      setPaused(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (uri) {
      checkForLocal();
    }
  }, [uri]);

  const checkForLocal = async () => {
    try {
      const result = await isFileExists(uri);
      if (!result.isExists) {
        const res = await ReactNativeBlobUtil.config({
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
        setLocalUri(res.path());
      } else {
        setLocalUri(result.filePath);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLoadStart = () => {
    setVideoLoading(true);
  };

  const onReadyForDisplay = () => {
    setVideoLoading(false);
  };

  return (
    <View
      style={[
        styles.videoContainer,
        {elevation: localUri && videoLoading ? 4 : 0},
      ]}>
      {localUri && (
        <VideoPlayer
          ref={videoRef}
          source={{uri: localUri}}
          style={styles.video}
          paused={paused}
          muted={true}
          // posterResizeMode="cover"
          resizeMode="cover"
          onLoadStart={onLoadStart}
          onReadyForDisplay={onReadyForDisplay}
          disableFullscreen={true}
          disableTimer={true}
          disableBack={true}
          {...otherProps}
        />
      )}
      {!localUri && (
        <View style={styles.videoOvarlay}>
          <ActivityIndicator size={'large'} color={COLORS.black} />
        </View>
      )}
    </View>
  );
};

export default React.memo(VideoMediaPlayer);

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    borderRadius: 8,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOvarlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
