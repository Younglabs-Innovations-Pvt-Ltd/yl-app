import React, {useState, useMemo, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import ModalComponent from '../modal.component';
import {COLORS} from '../../utils/constants/colors';
import TextWrapper from '../text-wrapper.component';
import {FONTS} from '../../utils/constants/fonts';
import Icon from '../icon.component';
import RatingStars from '../rating-stars';
import {useDispatch, useSelector} from 'react-redux';
import {
  markNMI,
  saveRating,
  setNotInterestedPopup,
} from '../../store/join-demo/join-demo.reducer';
import {localStorage} from '../../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';
import {joinDemoSelector} from '../../store/join-demo/join-demo.selector';

const CARD_WIDTH = 296;

const RatingPopup = ({visible, onClose, bookingId}) => {
  const [rating, setRating] = useState(0);

  const scrollViewRef = useRef();

  const dispatch = useDispatch();

  const {nmiLoading} = useSelector(joinDemoSelector);

  // Marked need more info
  const markNeedMoreInfo = async () => {
    dispatch(markNMI({bookingId}));
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // On change rating state
  const onChangeRating = rate => {
    setRating(rate);
    if (bookingId) {
      localStorage.delete(LOCAL_KEYS.JOIN_CLASS);
      dispatch(saveRating({bookingId, rating: rate * 2}));
    }

    scrollViewRef.current &&
      scrollViewRef.current.scrollTo({x: CARD_WIDTH, animated: true});
  };

  const NMI_LOADING = useMemo(() => {
    if (!nmiLoading) return null;

    return <ActivityIndicator color={COLORS.white} size={'small'} />;
  }, [nmiLoading]);

  const onOpenNotInterested = () => {
    dispatch(setNotInterestedPopup(true));
  };

  return (
    <ModalComponent visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.07)',
          paddingHorizontal: 16,
        }}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.ratingContainer}>
            <Icon
              name="close"
              size={24}
              color="#434a52"
              style={{alignSelf: 'flex-end', marginBottom: 12}}
              onPress={onClose}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              ref={scrollViewRef}
              scrollEnabled={false}>
              <View
                style={{
                  width: CARD_WIDTH,
                  justifyContent: 'center',
                }}>
                <TextWrapper
                  fs={24}
                  ff={FONTS.signika_medium}
                  styles={{textAlign: 'center'}}>
                  How was your class?
                </TextWrapper>
                <TextWrapper
                  fs={24}
                  ff={FONTS.signika_medium}
                  styles={{textAlign: 'center'}}>
                  Rate us.
                </TextWrapper>
                <View style={styles.ratings}>
                  <RatingStars
                    rating={rating}
                    onChangeRating={onChangeRating}
                    // color="#434a52"
                    color={COLORS.pblue}
                  />
                </View>
              </View>
              <View style={{width: CARD_WIDTH}}>
                <TextWrapper
                  fs={22}
                  ff={FONTS.signika_medium}
                  styles={{textAlign: 'center', marginBottom: 16}}>
                  Would you like to continue with the complete course and
                  improve your child's handwriting?
                </TextWrapper>
                <Pressable
                  style={({pressed}) => [
                    styles.ctaButton,
                    {opacity: pressed ? 0.8 : 1},
                  ]}
                  disabled={nmiLoading}
                  onPress={markNeedMoreInfo}>
                  <TextWrapper fs={18} color={COLORS.white}>
                    Yes, Need more info
                  </TextWrapper>
                  {NMI_LOADING}
                </Pressable>
                <Pressable
                  style={({pressed}) => [
                    styles.ctaButton,
                    {opacity: pressed ? 0.8 : 1, marginTop: 8},
                  ]}
                  disabled={nmiLoading}
                  onPress={onOpenNotInterested}>
                  <TextWrapper fs={18} color={COLORS.white}>
                    No, I don't want
                  </TextWrapper>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </ModalComponent>
  );
};

export default RatingPopup;

const styles = StyleSheet.create({
  ratingContainer: {
    width: 328,
    minHeight: 200,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    borderRadius: 10,
    elevation: 10,
  },
  ratings: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaButton: {
    height: 48,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
    backgroundColor: COLORS.pblue,
  },
});
