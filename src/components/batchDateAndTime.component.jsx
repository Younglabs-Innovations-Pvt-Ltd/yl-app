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
} from '../store/course/course.reducer';
import {useDispatch} from 'react-redux';

const BatchDateAndTime = ({
  batch,
  currentSelectedBatch,
  levelText,
  option,
  level,
}) => {
  if (!batch) return null;

  const date = new Date(batch.startDate._seconds * 1000);
  const dateAndTime = moment(date).format('MMMM Do [at] h:mm A');

  const dispatch = useDispatch();

  const handleBatch = () => {
    dispatch(setCurrentSelectedBatch(batch));
    dispatch(setLevelText(option));
    dispatch(setCurrentLevel(level));
  };

  const BACKGROUND_COLOR =
    levelText === option &&
    currentSelectedBatch &&
    currentSelectedBatch.batchId === batch.batchId
      ? COLORS.pblue
      : 'transparent';

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
      onPress={handleBatch}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <MIcon name="calendar-month" size={24} color={COLORS.black} />
        <TextWrapper fs={17}>{dateAndTime}</TextWrapper>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          marginTop: 8,
        }}>
        {batch.daysArr.split(',').map((item, index) => (
          <TextWrapper key={index} color={COLORS.black}>
            {item}
          </TextWrapper>
        ))}
      </View>
    </Pressable>
  );
};

export default BatchDateAndTime;

const styles = StyleSheet.create({});
