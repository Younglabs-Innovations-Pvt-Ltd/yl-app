import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ModalComponent from '../modal.component';
import {COLORS} from '../../utils/constants/colors';
import TextWrapper from '../text-wrapper.component';
import {FONTS} from '../../utils/constants/fonts';
import Icon from '../icon.component';
import RatingStars from '../rating-stars';
import {useDispatch} from 'react-redux';
import {saveRating} from '../../store/join-demo/join-demo.reducer';
import {localStorage} from '../../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../../utils/constants/local-keys';

const RatingPopup = ({visible, onClose, bookingId}) => {
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();

  // On change rating state
  const onChangeRating = rate => {
    setRating(rate);
    if (bookingId) {
      localStorage.delete(LOCAL_KEYS.JOIN_CLASS);
      dispatch(saveRating({bookingId, rating: rate * 2}));
    }
    setTimeout(() => {
      onClose();
    }, 300);
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
        <View style={styles.ratingContainer}>
          <Icon
            name="close"
            size={24}
            color="#434a52"
            style={{alignSelf: 'flex-end', marginBottom: 12}}
            onPress={onClose}
          />
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
      </View>
    </ModalComponent>
  );
};

export default RatingPopup;

const styles = StyleSheet.create({
  ratingContainer: {
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
});
