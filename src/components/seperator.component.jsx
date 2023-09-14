import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Seperator = ({text}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.seperatorLine} />
      <Text style={styles.seperatorText}>{text}</Text>
      <View style={styles.seperatorLine} />
    </View>
  );
};

export default Seperator;

const styles = StyleSheet.create({
  wrapper: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
  },
  seperatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  seperatorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textTransform: 'uppercase',
  },
});
