import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextWrapper from './text-wrapper.component';

const Header = ({text}) => {
  return (
    <View style={styles.header}>
      <TextWrapper fs={18}>{text}</TextWrapper>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});
