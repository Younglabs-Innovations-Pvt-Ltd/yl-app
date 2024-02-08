import React from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import TextWrapper from './text-wrapper.component';
import moment from 'moment';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  setCurrentLevel,
  setCurrentSelectedBatch,
  setLevelText,
  setPrice,
  setStrikeThroughPrice,
} from '../store/course/course.reducer';
import {useDispatch, useSelector} from 'react-redux';

const BatchDateAndTime = ({
  batch,
  currentSelectedBatch,
  levelText,
  option,
  level,
  price,
  strikeThroughPrice,
}) => {
  if (!batch) return null;
  const date = new Date(batch.startDate._seconds * 1000);
  const dateAndTime = moment(date).format('MMMM Do [at] h:mm A');
  const {darkMode, bgColor, textColors} = useSelector(state => state.appTheme);

  const dispatch = useDispatch();

  const handleBatch = () => {
    dispatch(setCurrentSelectedBatch(batch));
    dispatch(setLevelText(option));
    dispatch(setCurrentLevel(level));
    dispatch(setPrice(price));
    dispatch(setStrikeThroughPrice(strikeThroughPrice));
  };

  const BACKGROUND_COLOR =
    levelText === option &&
    currentSelectedBatch &&
    currentSelectedBatch.batchId === batch.batchId
      ? COLORS.pblue
      : 'transparent';

  const TEXT_COLOR =
    levelText === option &&
    currentSelectedBatch &&
    currentSelectedBatch.batchId === batch.batchId
      ? 'white'
      : textColors.textPrimary;

  return (
    <Pressable
      style={{
        maxWidth: 298,
        borderWidth: 1.5,
        borderColor: '#eee',
        paddingHorizontal: 8,
        paddingVertical: 16,
        borderRadius: 6,
        backgroundColor: BACKGROUND_COLOR,
      }}
      className="w-full"
      onPress={handleBatch}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <MIcon name="calendar-month" size={24} color={TEXT_COLOR} />
        <TextWrapper fs={17} color={TEXT_COLOR}>
          {dateAndTime}
        </TextWrapper>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          marginTop: 8,
        }}>
        {batch.daysArr.split(',').map((item, index) => (
          <TextWrapper key={index} color={TEXT_COLOR}>
            {item}
          </TextWrapper>
        ))}
      </View>
    </Pressable>
  );
};

export default BatchDateAndTime;

const styles = StyleSheet.create({});
