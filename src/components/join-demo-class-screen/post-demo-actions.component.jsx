import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Linking} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import {COLORS} from '../../assets/theme/theme';
import Icon from '../icon.component';
import Button from '../button.component';

import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RATING_API =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/postdemo/saveRating';

const MARK_MORE_INFO_API =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/postdemo/markNeedMoreInfo';

const COURSE_URL = 'https://www.younglabs.in/course/Eng_Hw';

const PostDemoAction = () => {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [loading, setLoading] = useState(true);

  const {demoData} = useSelector(state => state.joinDemo);

  useEffect(() => {
    const checkForRating = async () => {
      try {
        const rating = await AsyncStorage.getItem('isRated');
        if (rating === 'true') {
          setIsRated(true);
        }
        setLoading(false);
      } catch (error) {
        console.log('async rated error', error);
      }
    };

    checkForRating();
  }, []);

  const handleSaveRating = async rate => {
    const rated = rate * 2;
    console.log('rating', rated);

    try {
      const response = await fetch(RATING_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: demoData.bookingId,
          rating: rated,
        }),
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('isRated', 'true');
        setIsRated(true);
      }
    } catch (error) {
      console.log('Demo rating error', error);
    }
  };

  const onChangeRating = rate => {
    setRating(rate);
    handleSaveRating(rate);
  };

  const redirectToWebsiteToBuyCourse = () => Linking.openURL(COURSE_URL);

  const markNeedMoreInfo = async () => {
    try {
      const response = await fetch(MARK_MORE_INFO_API, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({bookingId: demoData.bookingId}),
      });

      if (response.status === 200) {
        openWhatsApp();
      }
    } catch (error) {
      console.log('nmi error', error);
    }
  };

  const openWhatsApp = async () => {
    const phoneNumber = '+919289029696';
    let url = '';

    if (Platform.OS === 'android') {
      url = `whatsapp://send?phone=${phoneNumber}&text=interested`;
    } else if (Platform.OS === 'ios') {
      url = `whatsapp://wa.me/${phoneNumber}&text=interested`;
    }

    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) return;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      {!isRated ? (
        <View style={styles.ratingContainer}>
          <TextWrapper
            fs={28}
            color={COLORS.pgreen}
            fw="600"
            styles={{textAlign: 'center'}}>
            Congratulations for completing your free class.
          </TextWrapper>
          <View style={styles.ratingWrapper}>
            <TextWrapper fs={20}>Did you like it?</TextWrapper>
            <View style={styles.starsContainer}>
              {Array.from({length: 5}, (_, i) => {
                return (
                  <Pressable key={i} onPress={() => onChangeRating(i + 1)}>
                    <Icon
                      name={
                        rating
                          ? i < rating
                            ? 'star'
                            : 'star-outline'
                          : 'star-outline'
                      }
                      size={32}
                      color={
                        rating ? (i < rating ? COLORS.pgreen : 'gray') : 'gray'
                      }
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.ctasWrapper}>
          <TextWrapper fs={20} styles={{lineHeight: 28}}>
            Would you like to continue with the course and improve your child's
            handwriting?
          </TextWrapper>
          <View style={styles.ctas}>
            <Button
              textColor={COLORS.black}
              bg={COLORS.white}
              rounded={4}
              shadow={true}
              onPress={markNeedMoreInfo}>
              Yes, need more info
            </Button>
            <Button
              textColor={COLORS.black}
              bg={COLORS.white}
              rounded={4}
              shadow={true}
              onPress={redirectToWebsiteToBuyCourse}>
              Buy on website
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default PostDemoAction;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  ratingContainer: {
    marginTop: 16,
    height: 200,
  },
  ratingWrapper: {
    height: 146,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 8,
  },
  ctasWrapper: {
    paddingVertical: 12,
  },
  ctas: {
    flex: 1,
    gap: 8,
    marginTop: 16,
  },
});
