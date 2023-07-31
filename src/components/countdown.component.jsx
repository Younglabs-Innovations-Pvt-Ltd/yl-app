import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS} from '../assets/theme/theme';

const zeroPrefix = time => (time > 9 ? time : `0${time}`);

const CountDown = ({timeLeft}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <View style={styles.countdown}>
        <View style={styles.containerList}>
          {Object.entries(timeLeft)
            .filter(entry => entry[0] !== 'remainingTime')
            .map(time => {
              const label = time[0];
              const value = time[1];
              const updatedLabel =
                label.slice(0, 1).toUpperCase() + label.slice(1);

              return (
                <View key={label} style={styles.timeContainer}>
                  <Text style={styles.timeText}>{zeroPrefix(value)}</Text>
                  <Text style={styles.timeLabel}>{updatedLabel}</Text>
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default CountDown;

const styles = StyleSheet.create({
  countdown: {
    width: '100%',
    maxWidth: 448,
    paddingTop: 8,
  },
  timeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pgreen,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    marginTop: 2,
    fontFamily: FONTS.roboto,
  },
  timeText: {
    fontSize: 52,
    color: COLORS.white,
    fontFamily: FONTS.bigShoulders_semibold,
  },
  containerList: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 8,
  },
});
