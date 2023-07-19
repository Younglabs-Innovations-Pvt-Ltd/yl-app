import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Input from './input.component';
import Button from './button.component';
import Seperator from './spacer.component';
import {COLORS, FONTS} from '../assets/theme/theme';

const JoinDemo = ({handleBookingStatus}) => {
  const [phone, setPhone] = useState('');

  const handleDemoBookingId = () => {
    if (!phone) return;
    handleBookingStatus(phone);
  };

  return (
    <View>
      <View style={styles.headingWrapper}>
        <Text style={styles.heading}>
          Welcome to <Text style={styles.ylText}>YoungLabs</Text>
        </Text>
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.demoText}>
          Enter your mobile number to get free class details
        </Text>
        <Input
          placeholder="Enter mobile number"
          value={phone}
          inputMode="numeric"
          onChangeText={phoneNumber => setPhone(phoneNumber)}
        />
        <Seperator />
        <Button rounded={4} bg={COLORS.pgreen} onPress={handleDemoBookingId}>
          Submit
        </Button>
      </View>
    </View>
  );
};

export default JoinDemo;

const styles = StyleSheet.create({
  contentWrapper: {
    paddingVertical: 12,
    marginTop: 12,
  },
  headingWrapper: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
  },
  ylText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.pgreen,
  },
  demoText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONTS.roboto,
  },
});
