import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, ScrollView} from 'react-native';
import Input from '../components/input.component';

const ReScheduleScreen = () => {
  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <Input placeholder="Child Name" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ReScheduleScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  wrapper: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  spinner: {
    width: 48,
    height: 48,
  },
});
