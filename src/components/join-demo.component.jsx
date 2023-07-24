import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Input from './input.component';
import Button from './button.component';
import Seperator from './seperator.component';
import Spacer from './spacer.component';
import {COLORS, FONTS} from '../assets/theme/theme';

const JoinDemo = ({navigation, handleBookingStatus}) => {
  const [phone, setPhone] = useState('');

  const handleDemoBookingId = () => {
    if (!phone) return;
    handleBookingStatus(phone);
  };

  return (
    <View>
      <View style={styles.headingWrapper}>
        <Text style={styles.heading}>
          Welcome to <Text style={styles.ylText}>Younglabs</Text>
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
        <Spacer />
        <Button
          rounded={4}
          bg={COLORS.pgreen}
          onPress={handleDemoBookingId}
          textColor={COLORS.white}
          shadow={true}>
          Submit
        </Button>
      </View>
      <Spacer space={4} />
      <Seperator text="or" />
      <Spacer space={4} />
      <Button
        rounded={4}
        bg="transparent"
        outlined={true}
        outlineColor={COLORS.black}
        textColor={COLORS.black}
        onPress={() => navigation.navigate('BookDemoForm')}>
        Book A Free class
      </Button>
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
  animatedLogo: {
    width: 160,
    height: 160,
    objectFit: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
