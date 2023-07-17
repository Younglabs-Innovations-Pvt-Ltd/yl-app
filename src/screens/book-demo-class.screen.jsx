import React, {useState, useEffect} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, ScrollView} from 'react-native';
import Input from '../components/input.component';
import Spacer from '../components/spacer.component';
import {Dropdown, DropdownList} from '../components/dropdown.component';
import TextWrapper from '../components/text-wrapper.component';
import Button from '../components/button.component';
import {COLORS} from '../assets/theme/theme';

const ageList = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const GEO_LOCATION_API =
  'https://api.ipgeolocation.io/ipgeo?apiKey=db02b89808894a7a9ddef353d01805dd';

const BookDemoScreen = () => {
  const [gutter, setGutter] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    const getTimeZone = async () => {
      try {
        const response = await fetch(GEO_LOCATION_API, {
          method: 'GET',
        });

        const data = await response.json();
        console.log('timezone data', data);
      } catch (error) {
        console.log('Timezone error', error);
      }
    };

    getTimeZone();
  }, []);

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
