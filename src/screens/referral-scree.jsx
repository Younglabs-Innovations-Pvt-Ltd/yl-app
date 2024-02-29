import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  View,
} from 'react-native';
import TextWrapper from '../components/text-wrapper.component';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import Spacer from '../components/spacer.component';
import {FONTS} from '../utils/constants/fonts';
import {COLORS} from '../utils/constants/colors';
import Seperator from '../components/seperator.component';
import Clipboard from '@react-native-clipboard/clipboard';

// Icons
import GiftBoxIcon from '../assets/icons/giftbox.png';
import WhatsAppIcon from '../assets/icons/whatsapp.png';
import LinkIcon from '../assets/icons/link.png';
import Snackbar from 'react-native-snackbar';

const Referral = ({route}) => {
  const {referralCode} = route.params;

  const {bgSecondaryColor, bgColor, textColors} = useSelector(
    state => state.appTheme,
  );

  const code = referralCode ? referralCode.toUpperCase() : '';

  const copyReferralCode = () => {
    Clipboard.setString(code);
    Snackbar.show({
      text: `Referral code ${code} copied`,
      textColor: textColors.textSecondary,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const shareOnWhatsApp = async () => {
    let text = `I really liked Younglabs courses for my child.\n\nAdding you as a referral. You will get 15% off on Younglabs courses when you buy on their app Or website using the code: *${code}*\n\nWebsite: www.younglabs.in`;
    let whatsAppUrl = '';

    text = encodeURIComponent(text);

    if (Platform.OS === 'android') {
      whatsAppUrl = `whatsapp://send?text=${text}`;
    } else if (Platform.OS === 'ios') {
      whatsAppUrl = `whatsapp://wa.me/text=${text}`;
    }

    try {
      await Linking.openURL(whatsAppUrl);
    } catch (error) {
      console.log('join demo screen whatsapp redirect error', error);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['rgba(245, 245, 245, 0.5)', bgSecondaryColor]}
          start={{x: 0, y: 0}}
          locations={[0.3, 0.7]}>
          <View style={styles.heroContainer}>
            <View style={{flex: 2}}>
              <TextWrapper
                fs={22.5}
                color={textColors.textPrimary}
                ff={FONTS.headingFont}>
                Refer and earn credits
              </TextWrapper>
              <Spacer space={6} />
              <TextWrapper
                fs={15}
                color={textColors.textSecondary}
                styles={{lineHeight: 22}}
                ff={FONTS.primaryFont}>
                Invite your friends to join Younglabs courses. They get instant
                15% off. You get credits of 15% of worth.
              </TextWrapper>
            </View>
            <View
              style={{
                // flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <Image source={GiftBoxIcon} style={styles.giftbox} />
              <Spacer space={4} />
              <Pressable
                style={({pressed}) => [
                  styles.referralCode,
                  {backgroundColor: bgColor, opacity: pressed ? 0.8 : 1},
                ]}
                onPress={copyReferralCode}>
                <TextWrapper
                  fs={14}
                  color={textColors.textSecondary}
                  ff={FONTS.primaryFont}>
                  {code}
                </TextWrapper>
              </Pressable>
            </View>
          </View>
          <Seperator text={'Refer Via'} color={textColors.textSecondary} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingVertical: 8,
            }}>
            <View style={{alignItems: 'center'}}>
              <Pressable style={styles.socialIcon} onPress={shareOnWhatsApp}>
                <Image source={WhatsAppIcon} style={styles.icon} />
              </Pressable>
              <TextWrapper
                fs={15}
                color={textColors.textSecondary}
                ff={FONTS.primaryFont}>
                WhatsApp
              </TextWrapper>
            </View>
            <View style={{alignItems: 'center'}}>
              <Pressable style={styles.socialIcon} onPress={copyReferralCode}>
                <Image source={LinkIcon} style={styles.icon} />
              </Pressable>
              <TextWrapper
                fs={15}
                color={textColors.textSecondary}
                ff={FONTS.primaryFont}>
                Copy referral code
              </TextWrapper>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          {/* How referral works */}
          <View style={[styles.card, {backgroundColor: bgSecondaryColor}]}>
            <TextWrapper
              fs={22}
              color={textColors.textPrimary}
              ff={FONTS.headingFont}>
              How referral works?
            </TextWrapper>
            <Spacer space={8} />
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 8}}>
              <View style={styles.circle}>
                <TextWrapper ff={FONTS.headingFont} color={COLORS.black}>
                  1
                </TextWrapper>
              </View>
              <TextWrapper
                ff={FONTS.primaryFont}
                color={textColors.textSecondary}
                fs={16.5}>
                Invite your friends
              </TextWrapper>
            </View>
            <Spacer />
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 8}}>
              <View style={styles.circle}>
                <TextWrapper ff={FONTS.headingFont} color={COLORS.black}>
                  2
                </TextWrapper>
              </View>
              <TextWrapper
                ff={FONTS.primaryFont}
                color={textColors.textSecondary}
                fs={16.5}
                styles={{flex: 1}}
                // style={{
                //   fontSize: 16.5,
                //   color: textColors.textSecondary,
                //   fontFamily: FONTS.primaryFont,
                // }}
              >
                They use your referral code and get 15% off
              </TextWrapper>
            </View>
            <Spacer />
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 8}}>
              <View style={styles.circle}>
                <TextWrapper ff={FONTS.headingFont} color={COLORS.black}>
                  3
                </TextWrapper>
              </View>
              <TextWrapper
                ff={FONTS.primaryFont}
                color={textColors.textSecondary}
                fs={16.5}>
                You get credits of 15% of worth
              </TextWrapper>
            </View>
          </View>

          <Spacer space={12} />

          {/* How to use credits */}
          <View style={[styles.card, {backgroundColor: bgSecondaryColor}]}>
            <TextWrapper
              fs={22}
              color={textColors.textPrimary}
              ff={FONTS.headingFont}>
              How to use credits?
            </TextWrapper>
            <Spacer space={8} />
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 8}}>
              <View style={styles.circle}>
                <TextWrapper ff={FONTS.headingFont} color={COLORS.black}>
                  1
                </TextWrapper>
              </View>
              <TextWrapper
                ff={FONTS.primaryFont}
                color={textColors.textSecondary}
                fs={16.5}>
                Refer with friends and earn credits
              </TextWrapper>
            </View>
            <Spacer />
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 8}}>
              <View style={styles.circle}>
                <TextWrapper ff={FONTS.headingFont} color={COLORS.black}>
                  2
                </TextWrapper>
              </View>
              <TextWrapper
                ff={FONTS.primaryFont}
                color={textColors.textSecondary}
                fs={16.5}>
                Go to payment
              </TextWrapper>
            </View>
            <Spacer />
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 8}}>
              <View style={styles.circle}>
                <TextWrapper ff={FONTS.headingFont} color={COLORS.black}>
                  3
                </TextWrapper>
              </View>
              <TextWrapper
                ff={FONTS.primaryFont}
                color={textColors.textSecondary}
                fs={16.5}>
                Click on Redeem Now button
              </TextWrapper>
            </View>
            <Spacer />
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 8}}>
              <View style={styles.circle}>
                <TextWrapper ff={FONTS.headingFont} color={COLORS.black}>
                  4
                </TextWrapper>
              </View>
              <TextWrapper
                ff={FONTS.primaryFont}
                color={textColors.textSecondary}
                fs={16.5}>
                Credits will be applied
              </TextWrapper>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Referral;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
  },
  giftbox: {
    width: 64,
    height: 64,
  },
  section: {
    padding: 20,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fefefe',
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 8,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  referralCode: {
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
});
