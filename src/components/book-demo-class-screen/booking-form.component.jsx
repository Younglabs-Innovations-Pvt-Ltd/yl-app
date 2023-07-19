import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import Input from '../input.component';
import TextWrapper from '../text-wrapper.component';
import {COLORS} from '../../assets/theme/theme';
import {Dropdown} from '../dropdown.component';
import Spacer from '../spacer.component';

const BookingForm = ({
  errorMessage,
  formFields,
  handleChangeValue,
  setVisible,
  setGutter,
  setOpen,
  country,
}) => {
  return (
    <View>
      <Input
        inputMode="text"
        placeholder="Enter your name"
        value={formFields.name}
        onChangeText={name => handleChangeValue({name})}
      />
      {errorMessage.name && (
        <TextWrapper fs={14} color={COLORS.pred}>
          {errorMessage.name}
        </TextWrapper>
      )}
      <Spacer />
      <View style={styles.row}>
        <Pressable
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.black,
          }}
          onPress={() => setVisible(p => !p)}>
          <TextWrapper>{country.callingCode}</TextWrapper>
        </Pressable>
        <Input
          inputMode="numeric"
          placeholder="Enter your phone number"
          value={formFields.phone}
          onChangeText={phone => handleChangeValue({phone})}
        />
      </View>
      {errorMessage.phone && (
        <TextWrapper fs={14} color={COLORS.pred}>
          {errorMessage.phone}
        </TextWrapper>
      )}
      <TextWrapper fs={14} color="gray">
        Please enter valid whatsapp number to receive further class details
      </TextWrapper>
      <Spacer />
      <Dropdown
        defaultValue="Select child age"
        value={formFields.childAge}
        onPress={() => setOpen(true)}
        onLayout={event =>
          setGutter(
            event.nativeEvent.layout.y + event.nativeEvent.layout.height,
          )
        }
      />
      {errorMessage.childAge && (
        <TextWrapper fs={14} color={COLORS.pred}>
          {errorMessage.childAge}
        </TextWrapper>
      )}
    </View>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
});
