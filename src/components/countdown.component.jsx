import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';

const zeroPrefix = time => (time > 9 ? time : `0${time}`);

const CountDown = ({timeLeft}) => {
  return (
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
        {/* {days > 0 && (
          <View style={styles.timeBlock}>
            <Text style={styles.timerText}>{zeroPrefix(days)}</Text>
            <Text style={styles.timeText}>Days</Text>
          </View>
        )}
        {hours > 0 && (
          <View style={styles.timeBlock}>
            <Text style={styles.timerText}>{zeroPrefix(hours)}</Text>
            <Text style={styles.timeText}>Hours</Text>
          </View>
        )}
        {hours <= 0 && (
          <View style={styles.timeBlock}>
            <Text style={styles.timerText}>{zeroPrefix(minutes)}</Text>
            <Text style={styles.timeText}>Minutes</Text>
          </View>
        )}
        {days <= 0 && hours <= 0 ? (
          <View style={styles.timeBlock}>
            <Text style={styles.timerText}>{zeroPrefix(seconds)}</Text>
            <Text style={styles.timeText}>Seconds</Text>
          </View>
        ) : null} */}
      </View>
    </View>
  );
};

export default CountDown;

const styles = StyleSheet.create({
  countdown: {
    width: '100%',
    backgroundColor: '#eaeaea',
    padding: 12,
    borderRadius: 8,
  },
  timeContainer: {
    flex: 1,
    height: 75,
    paddingHorizontal: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'gray',
    marginTop: 2,
  },
  timeText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  containerList: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 8,
  },
});
