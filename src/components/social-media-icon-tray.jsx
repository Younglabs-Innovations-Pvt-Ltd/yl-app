import React from 'react';
import {StyleSheet, Linking, View, Pressable} from 'react-native';
import TextWrapper from './text-wrapper.component';
import Icon from './icon.component';
import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';
import {useSelector} from 'react-redux';

const SocialMediaIconsTray = () => {
  const {textColors} = useSelector(state => state.appTheme);

  const openInstagram = async () => {
    try {
      const instagram_url = 'https://www.instagram.com/younglabs.in/';
      await Linking.openURL(instagram_url);
    } catch (error) {
      console.log('OPEN_INSTAGRAM_URL_ERROR', error);
    }
  };

  const openFacebook = async () => {
    try {
      const facebook_url = 'https://www.facebook.com/Younglabs/';
      await Linking.openURL(facebook_url);
    } catch (error) {
      console.log('OPEN_INSTAGRAM_URL_ERROR', error);
    }
  };

  const openWhatsapp = async () => {
    let whatappUrl = '';
    const phoneNumber = '+919289029696';

    if (Platform.OS === 'android') {
      whatappUrl = `whatsapp://send?phone=${phoneNumber}&text=Hello, I need more info about the full course`;
    } else if (Platform.OS === 'ios') {
      whatappUrl = `whatsapp://wa.me/${phoneNumber}&text=Hello, I need more info about the full course`;
    }
    try {
      await Linking.openURL(whatappUrl);
    } catch (error) {
      console.log('join demo screen whatsapp redirect error', error);
    }
  };

  return (
    <View style={styles.socialContainer}>
      <TextWrapper color={textColors.textSecondary} ff={FONTS.primaryFont}>
        Get in touch
      </TextWrapper>
      <View style={styles.socialMediaIconsWrapper}>
        <Pressable style={styles.btnSocialMedia} onPress={openFacebook}>
          <Icon name="logo-facebook" size={30} color="blue" />
        </Pressable>
        <Pressable style={styles.btnSocialMedia} onPress={openInstagram}>
          <Icon name="logo-instagram" size={30} color={COLORS.orange} />
        </Pressable>
        <Pressable style={styles.btnSocialMedia} onPress={openWhatsapp}>
          <Icon name="logo-whatsapp" size={30} color={COLORS.pgreen} />
        </Pressable>
      </View>
    </View>
  );
};

export default SocialMediaIconsTray;

const styles = StyleSheet.create({
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  socialMediaIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
    marginLeft: 16,
  },
});
