import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';

const zeroPrefix = time => (time > 9 ? time : `0${time}`);

const CountDown = ({timeLeft}) => {
  // UI Constants
  const TIMER = useMemo(() => {
    return Object.entries(timeLeft)
      .filter(entry => entry[0] !== 'remainingTime')
      .map(time => {
        const label = time[0];
        const value = time[1];
        const updatedLabel = label.slice(0, 1).toUpperCase() + label.slice(1);

        return (
          <View key={label} style={styles.timeContainer}>
            <Text style={styles.timeText}>{zeroPrefix(value)}</Text>
            <Text style={styles.timeLabel}>{updatedLabel}</Text>
          </View>
        );
      });
  }, [timeLeft]);

  return (
    <View>
      <View style={styles.countdown}>
        <View style={styles.containerList}>{TIMER}</View>
      </View>
    </View>
  );
};

export default CountDown;

const styles = StyleSheet.create({
  countdown: {
    // maxWidth: 448,
    // paddingTop: 8,
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: COLORS.pgreen,
    // borderRadius: 4,
    // paddingVertical: 8,
    // paddingHorizontal: 10,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#434a52',
    // marginTop: 2,
    fontFamily: FONTS.roboto,
  },
  timeText: {
    fontSize: 32,
    color: '#434a52',
    fontFamily: FONTS.bigShoulders_semibold,
  },
  containerList: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap: 8,
  },
});
