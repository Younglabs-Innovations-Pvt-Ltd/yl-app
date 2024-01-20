import React, {useEffect, useState, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Pressable,
  Linking,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import {COLORS} from '../../utils/constants/colors';
import Icon from '../icon.component';
import Spacer from '../spacer.component';

import {useDispatch, useSelector} from 'react-redux';
import {
  markNMI,
  saveRating,
  checkForRating,
  setNMI,
} from '../../store/join-demo/join-demo.reducer';

import {SCREEN_NAMES} from '../../utils/constants/screen-names';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';
import {joinDemoSelector} from '../../store/join-demo/join-demo.selector';
import ModalComponent from '../modal.component';
import NotInterested from '../not-interested.component';
import {localStorage} from '../../utils/storage/storage-provider';
import {FONTS} from '../../utils/constants/fonts';

const COURSE_URL = 'https://www.younglabs.in/course/Eng_Hw';

const {width: deviceWidth} = Dimensions.get('window');

const PostDemoAction = ({rescheduleClass}) => {
  const [rating, setRating] = useState(0);
  const [attended, setAttended] = useState(false);
  const [attendedLoading, setAttendedLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const {demoData, bookingDetails, isRated, ratingLoading, nmiLoading, isNmi} =
    useSelector(joinDemoSelector);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Show reschedule button
  // After 10 days when user join free class

  // Code To UnComment ------------------------
  // const isAllowToReschedule = useMemo(() => {
  //   if (demoData) {
  //     const {
  //       demoDate: {_seconds},
  //     } = demoData;
  //     const currentTime = Date.now();
  //     const afterTenDays = _seconds * 1000 + 1000 * 60 * 60 * 24 * 10;

  //     if (currentTime > afterTenDays) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // }, [demoData]);

  // const demoTime = useMemo(() => {
  //   if (demoData) {
  //     const time = new Date(demoData.demoDate._seconds * 1000);
  //     const demoHours = time.getHours();
  //     const demoMinutes = time.getMinutes();

  //     return demoHours >= 12
  //       ? `${demoHours === 12 ? demoHours : `0${demoHours - 12}`}:${
  //           demoMinutes > 0 ? demoMinutes : '00'
  //         } PM`
  //       : `${demoHours}:${demoMinutes > 0 ? demoMinutes : '00'} AM`;
  //   }
  // }, [demoData]);
  // Code To UnComment ------------------------

  // Check for rating from local storage
  // If rating then show post demos ctas
  useEffect(() => {
    dispatch(checkForRating());
  }, []);

  // Check for Attended
  useEffect(() => {
    const checkAttended = async () => {
      try {
        const checkAttended = localStorage.getString(LOCAL_KEYS.SAVE_ATTENDED);

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

  // Check NMI
  useEffect(() => {
    const checkNMI = async () => {
      try {
        const nmi = localStorage.getString(LOCAL_KEYS.NMI);
        console.log('nmiAsync', nmi);
        if (nmi) {
          console.log('hit NMI');
          dispatch(setNMI(true));
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    checkNMI();
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

  // Marked need more info
  const markNeedMoreInfo = async () => {
    dispatch(markNMI({bookingId: demoData.bookingId}));
  };

  const saveAttended = async () => {
    try {
      localStorage.set(LOCAL_KEYS.SAVE_ATTENDED, 'attended_yes');
      setAttended(true);
    } catch (error) {
      console.log('POST_ACTION_SAVE_ATTENDED_ERROR=', error);
    }
  };

  // Reschedule a free class
  // const rescheduleFreeClass = () => {
  //   const {childAge, parentName, phone, childName} = bookingDetails;
  //   const formFields = {childAge, parentName, phone, childName};

  //   navigation.navigate(SCREEN_NAMES.BOOK_DEMO_SLOTS, {formFields});
  // };

  const courseDetails = () => {
    navigation.navigate(SCREEN_NAMES.COURSE_DETAILS);
  };

  const batchDetails = () => {
    navigation.navigate(SCREEN_NAMES.BATCH_FEE_DETAILS);
  };

  const onClose = () => setVisible(false);

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
            color={
              rating ? (i < rating ? COLORS.white : COLORS.white) : COLORS.white
            }
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

  if (ratingLoading || attendedLoading || loading) return null;

  return (
    <View
      style={{
        width: '100%',
      }}
      className="">
      {!attended && (
        <View style={styles.paContainer} className="p-1">
          <TextWrapper
            fs={18}
            color={COLORS.white}
            ff={FONTS.signika_medium}
            styles={{textAlign: 'center'}}>
            Did you attend your free class?
          </TextWrapper>
          {/* <Spacer /> */}
          <View style={styles.paButtons} className="mt-1">
            <Pressable
              style={({pressed}) => [
                styles.paButton,
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={saveAttended}>
              <TextWrapper color={'#434a52'} fs={16} ff={FONTS.primaryFont}>
                Yes attended
              </TextWrapper>
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.paButton,
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={rescheduleClass}>
              <TextWrapper color={'#434a52'} fs={16} ff={FONTS.primaryFont}>
                Reschedule
              </TextWrapper>
            </Pressable>
          </View>
        </View>
      )}
      
      {!isRated && attended && (
        <View style={styles.ratingContainer} className="p-1">
          <TextWrapper
            fs={20}
            color={COLORS.white}
            fw="600"
            styles={{textAlign: 'center'}}
            ff={FONTS.headingFont}>
            Congratulations for attending your free class.
          </TextWrapper>
          <View style={styles.ratingWrapper}>
            <TextWrapper fs={16} color={COLORS.white} ff={FONTS.headingFont}>
              Please rate your class experience
            </TextWrapper>
            <View style={styles.starsContainer}>{RATING_STARS}</View>
          </View>
        </View>
      )}
      
      {isRated && !isNmi && (
        <View style={styles.ctasWrapper} className="p-1">
          <TextWrapper fs={18} color={COLORS.white} styles={{marginBottom: 8}}>
            Would you like to continue with the course and improve your child's
            handwriting?
          </TextWrapper>
          <View style={styles.ctas}>
            <Pressable
              style={({pressed}) => [
                styles.ctaButton,
                {opacity: pressed ? 0.8 : 1},
              ]}
              disabled={nmiLoading}
              onPress={markNeedMoreInfo}>
              {/* <MIcon name="whatsapp" size={22} color={COLORS.pgreen} /> */}
              <TextWrapper>Yes, need more info</TextWrapper>
              {NMI_LOADING}
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.paButton,
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => setVisible(true)}>
              <TextWrapper>No, I don't want</TextWrapper>
            </Pressable>
          </View>
        </View>
      )}

      {/* Commented out this code */}
      {/* {isNmi && (
        <View style={{padding: 16, width: '100%'}}>
          <TextWrapper
            color={COLORS.white}
            fs={18}
            ff={FONTS.headingFont}
            styles={{textAlign: 'center'}}>
            Give your child a gift of beautiful handwriting today!
          </TextWrapper>
          <Spacer space={6} />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              gap: 8,
              // backgroundColor: COLORS.pblue,
            }}>
            <Pressable
              style={({pressed}) => [
                styles.ctaButton,
                {flex: 1, opacity: pressed ? 0.8 : 1},
              ]}
              onPress={courseDetails}>
              <TextWrapper ff={FONTS.primaryFont} styles={{color:COLORS.pblue}}>Course details</TextWrapper>
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.ctaButton,
                {flex: 1, opacity: pressed ? 0.8 : 1},
              ]}
              onPress={batchDetails}>
              <TextWrapper ff={FONTS.primaryFont} styles={{color:COLORS.pblue}}>Batch/Fee details</TextWrapper>
            </Pressable>
          </View>
        </View>
      )} */}
      {/* Commented out this code */}


      <ModalComponent
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}>
        <NotInterested onClose={onClose} bookingDetails={bookingDetails} />
      </ModalComponent>
    </View>
  );
};

export default PostDemoAction;

const styles = StyleSheet.create({
  container: {
    // paddingTop: 12,
  },
  ratingContainer: {
    width: '100%',
  },
  ratingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 8,
  },
  ctasWrapper: {
    padding: 16,
  },
  ctas: {
    gap: 8,
  },
  ctaButton: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1.85,
    borderRadius: 50,
    gap: 8,
    backgroundColor: COLORS.white,
  },
  paContainer: {
    width: '100%',
  },
  paImage: {
    width: 250,
    height: 250,
    objectFit: 'contain',
  },
  paButtons: {
    gap: 8,
  },
  paButton: {
    paddingHorizontal: 2,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 50,
  },
});
