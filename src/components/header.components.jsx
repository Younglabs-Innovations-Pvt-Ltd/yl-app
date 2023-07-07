import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <View>
        <Image
          style={styles.logo}
          source={require('../images/YoungLabsLogo.png')}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
