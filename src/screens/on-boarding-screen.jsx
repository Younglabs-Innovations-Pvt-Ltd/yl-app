import React from 'react';
import {ScrollView, StyleSheet, Text, View, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const Screen1 = () => {
  return (
    <View style={{backgroundColor: 'red', width, height: '100%'}}>
      <Text>Screen 1</Text>
    </View>
  );
};

const Screen2 = () => {
  return (
    <View style={{backgroundColor: 'green', width, height: '100%'}}>
      <Text>Screen 2</Text>
    </View>
  );
};

const Screen3 = () => {
  return (
    <View style={{backgroundColor: 'purple', width, height: '100%'}}>
      <Text>Screen 3</Text>
    </View>
  );
};

const OnBoardingScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.container} horizontal pagingEnabled scroll>
      {[<Screen1 />, <Screen2 />, <Screen3 />].map((screen, index) => {
        return <View key={index}>{screen}</View>;
      })}
    </ScrollView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
