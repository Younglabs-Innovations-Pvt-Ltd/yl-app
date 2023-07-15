import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Input from '../components/input.component';
import Spacer from '../components/spacer.component';
import {Dropdown, DropdownList} from '../components/dropdown.component';
import TextWrapper from '../components/text-wrapper.component';
import Button from '../components/button.component';
import Header from '../components/header.components';
import {COLORS} from '../assets/theme/theme';

const ageList = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const {height} = Dimensions.get('window');

const BookDemoScreen = () => {
  const [gutter, setGutter] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleChangeValue = item => {
    setValue(item);
  };

  const handleOnClose = () => setOpen(false);

  return (
    <KeyboardAvoidingView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{height: '100%'}}>
        <View style={styles.container}>
          <View>
            <Input inputMode="text" placeholder="Enter your name" />
            <Spacer />
            <Input inputMode="numeric" placeholder="Enter your phone number" />
            <TextWrapper fs={14} color="gray">
              Please enter valid whatsapp number to receive further class
              details
            </TextWrapper>
            <Spacer />
            <Dropdown
              defaultValue="Select child age"
              value={value}
              onPress={() => setOpen(true)}
              onLayout={event =>
                setGutter(
                  event.nativeEvent.layout.y + event.nativeEvent.layout.height,
                )
              }
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button bg={COLORS.orange}>Select date and book</Button>
      </View>
      {open && (
        <DropdownList
          data={ageList}
          gutter={gutter}
          currentValue={value}
          onClose={handleOnClose}
          onChange={handleChangeValue}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default BookDemoScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 18,
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
