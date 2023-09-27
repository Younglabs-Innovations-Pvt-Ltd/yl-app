import React, {useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TextWrapper from '../text-wrapper.component';
import {COLORS} from '../../utils/constants/colors';
import Icon from '../icon.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useDispatch, useSelector} from 'react-redux';
import {
  markNMI,
  saveRating,
  checkForRating,
} from '../../store/join-demo/join-demo.reducer';

import {SCREEN_NAMES} from '../../utils/constants/screen-names';

const COURSE_URL = 'https://www.younglabs.in/course/Eng_Hw';

const PostDemoAction = () => {
  const [rating, setRating] = useState(0);

  const {demoData, bookingDetails, isRated, ratingLoading, nmiLoading} =
    useSelector(state => state.joinDemo);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Show reschedule button
  // After 10 days when user join free class
  const isAllowToReschedule = useMemo(() => {
    if (demoData) {
      const {
        demoDate: {_seconds},
      } = demoData;
      const currentTime = Date.now();
      const afterTenDays = _seconds * 1000 + 1000 * 60 * 60 * 24 * 10;

      if (currentTime > afterTenDays) {
        return true;
      } else {
        return false;
      }
    }
  }, [demoData]);

  // Check for rating from local storage
  // If rating then show post demos ctas
  useEffect(() => {
    dispatch(checkForRating());
  }, []);

  // Save rating of user
  // Dispatch an action to reducer
  // That join saga is listening
  const handleSaveRating = async rate => {
    const rated = rate * 2;

    dispatch(saveRating({bookingId: demoData.bookingId, rating: rated}));
  };

  // On change rating state
  const onChangeRating = rate => {
    setRating(rate);
    handleSaveRating(rate);
  };

  const redirectToWebsiteToBuyCourse = async () => {
    try {
      await Linking.openURL(COURSE_URL);
    } catch (error) {
      console.log('POST_DEMO_ACTIONS_REDIRECT_ERROR=', error);
    }
  };

  // Marked need more info
  const markNeedMoreInfo = async () => {
    dispatch(markNMI({bookingId: demoData.bookingId}));
  };

  // Reschedule a free class
  const rescheduleFreeClass = () => {
    const {childAge, parentName, phone, childName} = bookingDetails;
    const formFields = {childAge, parentName, phone, childName};

    navigation.navigate(SCREEN_NAMES.BOOK_DEMO_SLOTS, {formFields});
  };

  // UI Constants
  const RATING_STARS = useMemo(() => {
    return Array.from({length: 5}, (_, i) => {
      return (
        <Pressable key={i} onPress={() => onChangeRating(i + 1)}>
          <Icon
            name={
              rating ? (i < rating ? 'star' : 'star-outline') : 'star-outline'
            }
            size={32}
            color={rating ? (i < rating ? COLORS.pgreen : 'gray') : 'gray'}
          />
        </Pressable>
      );
    });
  }, [rating]);

  // Loading indicator while mark nmi
  const NMI_LOADING = useMemo(() => {
    if (!nmiLoading) return null;

    return (
      <ActivityIndicator
        color={COLORS.black}
        size={'large'}
        style={{alignSelf: 'flex-end'}}
      />
    );
  }, [nmiLoading]);

  if (ratingLoading) return null;

  return (
    <View style={styles.container}>
      {!isRated ? (
        <View style={styles.ratingContainer}>
          <TextWrapper
            fs={28}
            color={COLORS.pgreen}
            fw="600"
            styles={{textAlign: 'center'}}>
            Congratulations for attending your free class.
          </TextWrapper>
          <View style={styles.ratingWrapper}>
            <TextWrapper fs={20}>Please rate your class experience</TextWrapper>
            <View style={styles.starsContainer}>{RATING_STARS}</View>
          </View>
        </View>
      ) : (
        <View style={styles.ctasWrapper}>
          <TextWrapper fs={20} styles={{lineHeight: 28}}>
            Would you like to continue with the course and improve your child's
            handwriting?
          </TextWrapper>
          <View style={styles.ctas}>
            {isAllowToReschedule && (
              <Pressable
                style={({pressed}) => [
                  styles.ctaButton,
                  {opacity: pressed ? 0.8 : 1},
                ]}
                onPress={rescheduleFreeClass}>
                <TextWrapper>Reschedule a new class</TextWrapper>
              </Pressable>
            )}
            <Pressable
              style={({pressed}) => [
                styles.ctaButton,
                {opacity: pressed ? 0.8 : 1},
              ]}
              disabled={nmiLoading}
              onPress={markNeedMoreInfo}>
              <MIcon name="whatsapp" size={22} color={COLORS.pgreen} />
              <TextWrapper>Yes, need more info</TextWrapper>
              {NMI_LOADING}
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.ctaButton,
                {opacity: pressed ? 0.8 : 1},
              ]}
              onPress={redirectToWebsiteToBuyCourse}>
              <MIcon name="web" size={22} color={COLORS.black} />
              <TextWrapper>Buy on website</TextWrapper>
            </Pressable>
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
    gap: 10,
    marginTop: 20,
  },
  ctaButton: {
    height: 48,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1.85,
    borderRadius: 4,
    gap: 8,
    backgroundColor: COLORS.white,
  },
});
