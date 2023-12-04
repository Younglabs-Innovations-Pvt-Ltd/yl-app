import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Icon from './icon.component';
import {COLORS} from '../utils/constants/colors';
import Modal from './modal.component';
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

const VideoPlayer = ({uri}) => {
  const videoRef = useRef();
  const thumbRef = useRef();
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoding] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [thumbLoading, setThumbLoading] = useState(true);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log(isFocused);
  }, [isFocused]);

  const onLoadStart = () => {
    setLoding(true);
  };

  const onReadyForDisplay = () => {
    setLoding(false);
  };

  const onOpen = () => {
    setVisible(true);
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

  const onEnd = () => {
    setIsEnded(true);
  };

  const onThumReadyForDisplay = () => {
    setThumbLoading(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Video
          ref={thumbRef}
          source={{uri}}
          style={{
            width: '100%',
            height: '100%',
          }}
          focusable={false}
          muted={true}
          onReadyForDisplay={onThumReadyForDisplay}
          onEnd={onEnd}
          resizeMode="cover"
          disableFocus={true}
        />
        {thumbLoading && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: '#eee',
            }}></View>
        )}
        {isEnded && (
          <View style={styles.poster}>
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Pressable onPress={onOpen}>
                <Icon
                  name="play-circle-outline"
                  size={64}
                  color={COLORS.white}
                />
              </Pressable>
            </View>
          </View>
        )}
      </View>
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
            ref={videoRef}
            source={{uri}}
            style={{width: '100%', height: '100%', alignSelf: 'center'}}
            onLoadStart={onLoadStart}
            onReadyForDisplay={onReadyForDisplay}
            muted={muted}
            resizeMode="contain"
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

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    width: 135,
    aspectRatio: 9 / 16,
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
    backgroundColor: 'transparent',
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
