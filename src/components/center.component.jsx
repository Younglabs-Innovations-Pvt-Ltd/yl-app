import React from 'react';
import {StyleSheet, View} from 'react-native';

const Center = ({children, bg = 'transparent'}) => {
  return <View style={[styles.center, {backgroundColor: bg}]}>{children}</View>;
};

export default Center;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
