import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';
import {useSelector} from 'react-redux';

const zeroPrefix = time => (time > 9 ? time : `0${time}`);

const CountDown = ({timeLeft}) => {
  const {darkMode, textColors} = useSelector(state => state.appTheme);
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
            <Text
              style={[
                styles.timeText,
                {color: darkMode ? textColors.textYlMain : 'white'},
              ]}>
              {zeroPrefix(value)}
            </Text>
            <Text
              style={[
                styles.timeLabel,
                {color: darkMode ? textColors.textYlMain : 'white'},
              ]}
              className="mt-[2px]"
              >
              {updatedLabel}
            </Text>
          </View>
        );
      });
  }, [timeLeft]);

  return (
    <View>
      <View style={styles.countdown} className="w-full">
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
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: FONTS.roboto,
  },
  timeText: {
    fontSize: 32,
    fontFamily: FONTS.bigShoulders_semibold,
  },
  containerList: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // gap: 8,
  },
});
