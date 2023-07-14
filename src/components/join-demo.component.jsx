import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Input from './input.component';
import Button from './button.component';
import Seperator from './spacer.component';
import {COLORS} from '../theme/theme';

const JoinDemo = ({handleBookingStatus}) => {
  const [phone, setPhone] = useState('');

  const handleDemoBookingId = () => {
    if (!phone) return;
    handleBookingStatus(phone);
  };

  return (
    <View>
      <Text style={styles.demoText}>
        Enter your mobile number to get demo class details
      </Text>
      <Input
        placeholder="Enter mobile number"
        value={phone}
        inputMode="numeric"
        onChangeText={phoneNumber => setPhone(phoneNumber)}
      />
      <Seperator />
      <Button bg={COLORS.pgreen} onPress={handleDemoBookingId}>
        Submit
      </Button>
    </View>
  );
};

export default JoinDemo;

const styles = StyleSheet.create({
  demoText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.black,
  },
});
