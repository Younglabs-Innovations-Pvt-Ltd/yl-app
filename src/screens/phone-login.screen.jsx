import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {FONTS} from '../utils/constants/fonts';

const PhoneLogin = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper} className="relative">
        <TextInput
          style={[
            styles.input,
            {
              fontFamily: FONTS.primaryFont,
              fontSize: 16,
              color: COLORS.black,
            },
          ]}
          selectionColor={COLORS.black}
          // onChangeText={e => setEmail(e)}
          // value={email}
          inputMode="numeric"
          className="w-full border rounded-md border-gray-400"
          autoCapitalize="none"
        />
        <Text
          style={{fontFamily: FONTS.primaryFont}}
          className="absolute text-[16px] bg-white -top-3 left-4 px-1 text-gray-500">
          Enter Phone
        </Text>
      </View>
    </View>
  );
};

export default PhoneLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 38,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    letterSpacing: 1.15,
    color: COLORS.black,
  },
});
