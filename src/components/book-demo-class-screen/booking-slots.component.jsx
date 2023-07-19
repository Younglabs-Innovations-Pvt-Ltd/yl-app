import React, {useMemo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import Spacer from '../spacer.component';
import {COLORS} from '../../assets/theme/theme';

const BookingSlots = ({
  slots,
  currentSlotDate,
  currentSlotTime,
  handleCurrentSlotTime,
  handleCurrentSlotDate,
}) => {
  // Arrange slot time by show date
  const slotsTime = useMemo(() => {
    let updatedSlots = {};
    slots.forEach(slot => {
      updatedSlots[slot.showDate] = slot.data;
    });

    return updatedSlots;
  }, []);

  return (
    <View>
      <View style={styles.slotsWrapper}>
        <TextWrapper fs={20} color="gray" fw="bold">
          Select date:
        </TextWrapper>
        <View style={styles.slotDateList}>
          {slots.map(slot => {
            return (
              <Pressable
                style={[
                  styles.slotDate,
                  currentSlotDate === slot.showDate
                    ? {backgroundColor: COLORS.pgreen}
                    : {borderWidth: 1, borderColor: 'gray'},
                ]}
                key={slot.showDate}
                onPress={() => handleCurrentSlotDate(slot.showDate)}>
                <TextWrapper
                  color={
                    currentSlotDate === slot.showDate
                      ? COLORS.white
                      : COLORS.black
                  }>
                  {slot.showDate}
                </TextWrapper>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Spacer />

      <View style={styles.slotsWrapper}>
        <TextWrapper fs={20} color="gray" fw="bold">
          Select time:
        </TextWrapper>
        <View style={styles.slotDateList}>
          {slotsTime[currentSlotDate].map(slotTime => {
            return (
              <Pressable
                style={[
                  styles.slotDate,
                  currentSlotTime.showTimings === slotTime.showTimings
                    ? {backgroundColor: COLORS.pgreen}
                    : {borderWidth: 1, borderColor: 'gray'},
                ]}
                key={slotTime.slotId}
                onPress={() => handleCurrentSlotTime(slotTime)}>
                <TextWrapper
                  color={
                    currentSlotTime.showTimings === slotTime.showTimings
                      ? COLORS.white
                      : COLORS.black
                  }>
                  {slotTime.showTimings}
                </TextWrapper>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default BookingSlots;

const styles = StyleSheet.create({
  slotsWrapper: {
    width: '100%',
  },
  slotDateList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 12,
  },
  slotDate: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
});
