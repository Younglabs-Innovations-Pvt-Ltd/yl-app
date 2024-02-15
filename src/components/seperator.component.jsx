import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Seperator = ({text, color}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.seperatorLine, {backgroundColor: color}]} />
      <Text style={[styles.seperatorText, {color}]}>{text}</Text>
      <View style={[styles.seperatorLine, {backgroundColor: color}]} />
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
    height: StyleSheet.hairlineWidth,
  },
  seperatorText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});
