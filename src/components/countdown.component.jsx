import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

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
                <Text style={styles.timeText}>{value}</Text>
                <Text style={styles.timeLabel}>{updatedLabel}</Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default CountDown;

const styles = StyleSheet.create({
  countdown: {
    width: '100%',
    backgroundColor: '#eaeaea',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 16,
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
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  containerList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
});
