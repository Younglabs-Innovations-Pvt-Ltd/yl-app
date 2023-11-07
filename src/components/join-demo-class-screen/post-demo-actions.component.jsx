import React, {useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Linking,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TextWrapper from '../text-wrapper.component';
import {COLORS} from '../../utils/constants/colors';
import Icon from '../icon.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spacer from '../spacer.component';

import {useDispatch, useSelector} from 'react-redux';
import {
  markNMI,
  saveRating,
  checkForRating,
} from '../../store/join-demo/join-demo.reducer';

import {SCREEN_NAMES} from '../../utils/constants/screen-names';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';

const COURSE_URL = 'https://www.younglabs.in/course/Eng_Hw';

const IMAGE_URI =
  'https://live-server-8353.wati.io/api/file/showFile?fileName=data/images/WhatsApp_Image_2022_06_17_at_4.58.13_PM-47559edc-8e40-4c7a-9ce3-db0ac32b085d.jpg&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YTlhMjgwYi1jNGI5LTQxMDYtOWU0NS04MDY4MGY0OWRiZTYiLCJ1bmlxdWVfbmFtZSI6ImtyaXNobmEua0B5b3VuZ2xhYnMuaW4iLCJuYW1laWQiOiJrcmlzaG5hLmtAeW91bmdsYWJzLmluIiwiZW1haWwiOiJrcmlzaG5hLmtAeW91bmdsYWJzLmluIiwiYXV0aF90aW1lIjoiMTAvMzAvMjAyMyAwNTowODoxMiIsImRiX25hbWUiOiI4MzUzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQURNSU5JU1RSQVRPUiIsImV4cCI6MjUzNDAyMzAwODAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.PYlZDcDz6SezkwsvsCaLHkTA2TNAnsBmUgDtkMOF3F8';

const PostDemoAction = () => {
  const [rating, setRating] = useState(0);
  const [attended, setAttended] = useState(false);
  const [attendedLoading, setAttendedLoading] = useState(true);

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

  const demoTime = useMemo(() => {
    if (demoData) {
      const time = new Date(demoData.demoDate._seconds * 1000);
      const demoHours = time.getHours();
      const demoMinutes = time.getMinutes();

      return demoHours >= 12
        ? `${demoHours === 12 ? demoHours : `0${demoHours - 12}`}:${
            demoMinutes > 0 ? demoMinutes : '00'
          } PM`
        : `${demoHours}:${demoMinutes > 0 ? demoMinutes : '00'} AM`;
    }
  }, [demoData]);

  // Check for rating from local storage
  // If rating then show post demos ctas
  useEffect(() => {
    dispatch(checkForRating());
  }, []);

  useEffect(() => {
    const checkAttended = async () => {
      try {
        const checkAttended = await AsyncStorage.getItem(
          LOCAL_KEYS.SAVE_ATTENDED,
        );

        if (checkAttended) {
          setAttended(true);
        }

        setAttendedLoading(false);
      } catch (error) {
        console.log('POST_ACTION_CHECK_ATTENDED_ERROR=', error);
      }
    };

    checkAttended();
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

  const saveAttended = async () => {
    try {
      await AsyncStorage.setItem(LOCAL_KEYS.SAVE_ATTENDED, 'attended_yes');
      setAttended(true);
    } catch (error) {
      console.log('POST_ACTION_SAVE_ATTENDED_ERROR=', error);
    }
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

  if (ratingLoading || attendedLoading) return null;

  return (
    <View style={styles.container}>
      {!attended && (
        <View style={styles.paContainer}>
          {/* <Image source={{uri: IMAGE_URI}} style={styles.paImage} /> */}
          <TextWrapper fs={24} fw="700" styles={{textAlign: 'center'}}>
            Hello, {bookingDetails?.parentName}
          </TextWrapper>
          <Spacer space={4} />
          <TextWrapper fs={17} styles={{textAlign: 'center'}}>
            We had a wonderful handwriting session at{' '}
            <TextWrapper fw="700">{demoTime}</TextWrapper>.
          </TextWrapper>
          <Spacer />
          <TextWrapper fs={18} styles={{textAlign: 'center'}}>
            We covered basic letters, joining, and a sentence too! We'll
            continue the classes in the next session and start with basic
            strokes which help in handwriting improvement.
          </TextWrapper>
          <Spacer />
          <View style={styles.paButtons}>
            <Pressable
              style={({pressed}) => [
                styles.paButton,
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={saveAttended}>
              <TextWrapper color="rgb(14, 113, 195)" fs={18}>
                Yes attended
              </TextWrapper>
            </Pressable>
            <Spacer space={6} />
            <Pressable
              style={({pressed}) => [
                styles.paButton,
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={rescheduleFreeClass}>
              <TextWrapper color="rgb(14, 113, 195)" fs={18}>
                Reschedule
              </TextWrapper>
            </Pressable>
          </View>
        </View>
      )}
      {attended ? (
        !isRated ? (
          <View style={styles.ratingContainer}>
            <TextWrapper
              fs={28}
              color={COLORS.pgreen}
              fw="600"
              styles={{textAlign: 'center'}}>
              Congratulations for attending your free class.
            </TextWrapper>
            <View style={styles.ratingWrapper}>
              <TextWrapper fs={20}>
                Please rate your class experience
              </TextWrapper>
              <View style={styles.starsContainer}>{RATING_STARS}</View>
            </View>
          </View>
        ) : (
          <View style={styles.ctasWrapper}>
            <TextWrapper fs={20} styles={{lineHeight: 28}}>
              Would you like to continue with the course and improve your
              child's handwriting?
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
        )
      ) : null}
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
  paContainer: {
    paddingTop: 16,
    maxWidth: 450,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paImage: {
    width: 250,
    height: 250,
    objectFit: 'contain',
  },
  paButtons: {
    width: 200,
    paddingTop: 16,
  },
  paButton: {
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(235 237 241)',
    borderRadius: 4,
  },
});
