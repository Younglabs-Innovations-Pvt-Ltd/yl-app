import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Input from './input.component';
import Button from './button.component';
import Seperator from './seperator.component';

const JoinDemo = ({handleDemoId}) => {
  const [demoId, setDemoId] = useState('');

  const handleDemoBookingId = () => {
    if (!demoId) return;
    handleDemoId(demoId);
  };

  return (
    <View>
      <Input
        placeholder="Enter your demo id"
        value={demoId}
        inputMode="numeric"
        onChangeText={id => setDemoId(id)}
      />
      <Seperator />
      <Button bg="green" onPress={handleDemoBookingId}>
        Submit
      </Button>
    </View>
  );
};

export default JoinDemo;

const styles = StyleSheet.create({});
