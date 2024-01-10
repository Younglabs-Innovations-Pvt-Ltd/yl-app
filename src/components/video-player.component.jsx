import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import {COLORS} from '../utils/constants/colors';
import {useNavigation} from '@react-navigation/native';

const VideoMediaPlayer = ({uri, ...otherProps}) => {
  const [videoLoading, setVideoLoading] = useState(false);
  const [paused, setPaused] = useState(true);
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

  const onLoadStart = () => {
    setVideoLoading(true);
  };

  const onReadyForDisplay = () => {
    setVideoLoading(false);
  };

  return (
    <View
      style={[styles.videoContainer, {elevation: uri && videoLoading ? 4 : 0}]}>
      {uri && (
        <VideoPlayer
          ref={videoRef}
          source={{uri: uri}}
          style={styles.video}
          paused={true}
          resizeMode="cover"
          onLoadStart={onLoadStart}
          onReadyForDisplay={onReadyForDisplay}
          disableFullscreen={true}
          disableTimer={true}
          disableBack={true}
          {...otherProps}
        />
      )}
      {videoLoading && uri && (
        <View style={styles.videoOvarlay}>
          <ActivityIndicator size={'large'} color={COLORS.black} />
        </View>
      )}
    </View>
  );
};

export default VideoMediaPlayer;

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
