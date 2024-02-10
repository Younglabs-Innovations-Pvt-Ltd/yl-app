import React, {useEffect, useState, useMemo, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import {COLORS} from '../../utils/constants/colors';
import Spacer from '../spacer.component';

import {useDispatch, useSelector} from 'react-redux';
import {
  markNMI,
  saveRating,
  checkForRating,
  setIsAttended,
  setNotInterestedPopup,
} from '../../store/join-demo/join-demo.reducer';

import {SCREEN_NAMES} from '../../utils/constants/screen-names';
import {joinDemoSelector} from '../../store/join-demo/join-demo.selector';
import ModalComponent from '../modal.component';
import NotInterested from '../not-interested.component';
import {FONTS} from '../../utils/constants/fonts';
import RatingStars from '../rating-stars';
import {welcomeScreenSelector} from '../../store/welcome-screen/selector';

const {width: deviceWidth} = Dimensions.get('window');

const PostDemoAction = ({rescheduleClass}) => {
  const [rating, setRating] = useState(0);

  const sliderRef = useRef();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const {
    demoData,
    bookingDetails,
    isRated,
    isAttended,
    nmiLoading,
    isNmi,
    notInterestedPopup,
  } = useSelector(joinDemoSelector);

  const {courses} = useSelector(welcomeScreenSelector);

  // console.log("demoData is", demoData)

  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Check for rating from local storage
  // If rating then show post demos ctas
  useEffect(() => {
    dispatch(checkForRating());
  }, []);

  const scrollSlider = scrollToX => {
    sliderRef.current &&
      sliderRef.current &&
      sliderRef.current.scrollTo({
        x: scrollToX,
        animated: true,
      });
    setCurrentSlideIndex(scrollToX / deviceWidth);
  };

  // useEffect(() => {
  //   if (isAttended && !isRated) {
  //     scrollSlider(deviceWidth);
  //   } else if (isRated && !isNmi) {
  //     scrollSlider(deviceWidth * 2);
  //   } else if (isNmi) {
  //     scrollSlider(deviceWidth * 3);
  //   }
  // }, [isAttended, isRated, isNmi]);

  useEffect(() => {
    if (isRated && !isNmi) {
      scrollSlider(deviceWidth * 2);
    }
  }, [isRated, isNmi]);

  // Save rating of user
  // Dispatch an action to reducer
  // That join saga is listening
  const handleSaveRating = async rate => {
    const rated = rate * 2;

    if (demoData) {
      dispatch(saveRating({bookingId: demoData.bookingId, rating: rated}));
    }
  };

  // On change rating state
  const onChangeRating = rate => {
    setRating(rate);
    handleSaveRating(rate);
  };

  // Marked need more info
  const markNeedMoreInfo = async () => {
    // mark nmi and go to corresponding course details
    dispatch(
      markNMI({
        bookingId: demoData.bookingId,
        courses,
        courseId: bookingDetails.courseId,
      }),
    );
  };

  const saveAttended = async () => {
    dispatch(setIsAttended(true));
    scrollSlider(deviceWidth);
  };

  const courseDetails = () => {
    navigation.navigate(SCREEN_NAMES.COURSE_DETAILS);
  };

  const batchDetails = () => {
    navigation.navigate(SCREEN_NAMES.BATCH_FEE_DETAILS);
  };

  const onMomentumScrollEnd = event => {
    const scrollToOffsetX = event.nativeEvent.contentOffset.x / deviceWidth;
    setCurrentSlideIndex(scrollToOffsetX);
  };

  // Loading indicator while mark nmi
  const NMI_LOADING = useMemo(() => {
    if (!nmiLoading) return null;

    return (
      <ActivityIndicator
        color={COLORS.black}
        size={'small'}
        style={{alignSelf: 'flex-end'}}
      />
    );
  }, [nmiLoading]);

  const IS_ATTENDED = useMemo(() => {
    return isAttended ? (
      <Pressable
        style={({pressed}) => [
          styles.paButton,
          {
            opacity: pressed ? 0.7 : 1,
            flexDirection: 'row',
          },
        ]}
        onPress={saveAttended}>
        <TextWrapper color={'#434a52'} fs={18}>
          Yes attended
        </TextWrapper>
      </Pressable>
    ) : null;
  }, [isAttended, saveAttended]);

  const ATTENDED_TEXT = useMemo(() => {
    return isAttended ? (
      <TextWrapper
        fs={20}
        color={COLORS.white}
        ff={FONTS.signika_medium}
        styles={{textAlign: 'center'}}>
        Did you attend your free class?
      </TextWrapper>
    ) : (
      <View style={{paddingTop: 16}}>
        <TextWrapper
          fs={24}
          color={COLORS.white}
          ff={FONTS.signika_medium}
          styles={{textAlign: 'center'}}>
          You missed your class
        </TextWrapper>
      </View>
    );
  }, [isAttended]);

  const onOpenNotInterested = () => {
    dispatch(setNotInterestedPopup(true));
  };

  const onCloseNotInterested = () => {
    dispatch(setNotInterestedPopup(false));
  };
  // if (ratingLoading || attendedLoading || loading) return null;

  return (
    <React.Fragment>
      <ScrollView
        ref={sliderRef}
        style={{
          flex: 1,
          alignSelf: 'center',
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEnabled={false}
        pagingEnabled>
        {/* {!attended && !isRated && ( */}
        {/* <View style={styles.container}>
          {ATTENDED_TEXT}
          <Spacer space={4} />
          <View style={styles.paButtons}>
            {IS_ATTENDED}
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
        </View> */}
        {/* )} */}
        {/* {!isRated && attended && ( */}
        <View style={styles.container}>
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
            <View style={styles.starsContainer}>
              <RatingStars
                rating={rating}
                onChangeRating={onChangeRating}
                color={COLORS.white}
              />
            </View>
          </View>
        </View>
        {/* )} */}
        {/* {isRated && !isNmi && ( */}
        <View style={styles.container}>
          <TextWrapper
            fs={17.5}
            color={COLORS.white}
            styles={{marginBottom: 8}}>
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
              <TextWrapper>Yes, Need more info</TextWrapper>
              {NMI_LOADING}
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.paButton,
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={onOpenNotInterested}>
              <TextWrapper>No, I don't want</TextWrapper>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 8,
            gap: 8,
          }}>
          {Array.from({length: 2}, (_, i) => {
            return (
              <View
                style={[
                  styles.dotIndicator,
                  {
                    backgroundColor:
                      currentSlideIndex === i ? COLORS.white : '#434a52',
                  },
                ]}
                key={i}></View>
            );
          })}
        </View>
      </View>

      <ModalComponent
        visible={notInterestedPopup}
        animationType="slide"
        onRequestClose={onCloseNotInterested}>
        {bookingDetails && (
          <NotInterested
            onClose={onCloseNotInterested}
            bookingDetails={bookingDetails}
          />
        )}
      </ModalComponent>
    </React.Fragment>
  );
};

export default PostDemoAction;

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    paddingHorizontal: 16,
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
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
});
