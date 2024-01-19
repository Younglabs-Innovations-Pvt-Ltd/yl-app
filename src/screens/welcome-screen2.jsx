import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import BACKGROUND_IMAGE from '../assets/images/background2.jpeg';
import {IMAGES} from '../utils/constants/images';
import TextWrapper from '../components/text-wrapper.component';
import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';

const {width: deviceWidth} = Dimensions.get('window');
const IMAGE_WIDTH = deviceWidth * 0.7;
const IMAGE_HEIGHT = deviceWidth * 0.7;

const GAP = 48;

const WelcomeScreen2 = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={BACKGROUND_IMAGE} style={[styles.container]}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Image
              source={IMAGES.LOGO}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>
          <TextWrapper color={COLORS.black} fs={22} styles={styles.tagline}>
            Helping parents raise capable, skillful & happy children
          </TextWrapper>
        </View>
        <View style={styles.content}></View>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    position: 'relative',
    paddingHorizontal: 16,
  },
  logo: {
    alignSelf: 'center',
    height: 248,
    aspectRatio: 1 / 1,
  },
  tagline: {
    fontSize: 22,
    fontFamily: FONTS.gelasio_semibold,
    textTransform: 'capitalize',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 28,
    position: 'absolute',
    alignSelf: 'center',
    bottom: -GAP,
  },
  content: {
    marginTop: GAP,
    borderWidth: 2,
  },
});
