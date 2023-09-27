import React, {useState, useMemo} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from 'react-native';
import {COLORS} from '../utils/constants/colors';

import Input from '../components/input.component';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';

import {Dropdown, DropdownList} from '../components/dropdown.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';

const ageList = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const INITIAL_sTATE = {
  parentName: '',
  childName: '',
};

const BookDemoScreen = ({route, navigation}) => {
  const {phone, country} = route.params;
  const [gutter, setGutter] = useState(0);
  const [open, setOpen] = useState(false);
  const [childAge, setChildAge] = useState(null);
  const [fields, setFields] = useState(INITIAL_sTATE);

  /**
   * Check if any field is not empty
   */
  const isActive = useMemo(() => {
    if (!fields.parentName || !fields.childName || !childAge) {
      return false;
    }

    return true;
  }, [fields.childName, fields.parentName, childAge]);

  const onLayoutChange = event => {
    setGutter(event.nativeEvent.layout.y + event.nativeEvent.layout.height);
  };

  const handleChangeValue = e => {
    const {name, value} = e;
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(value)) {
      setFields(preVal => ({...preVal, [name]: value}));
    }
  };

  const handleOnClose = () => setOpen(false);

  const handleDemoSlots = async () => {
    const formFields = {...fields, phone, childAge};

    navigation.navigate(SCREEN_NAMES.BOOK_DEMO_SLOTS, {formFields});
  };

  const handleChildAge = ({childAge}) => {
    setChildAge(childAge);
  };

  const onChangeOpen = () => setOpen(true);

  const btnNextStyle = ({pressed}) => [
    styles.btnNext,
    {
      opacity: pressed ? 0.8 : 1,
      backgroundColor: !isActive ? '#eaeaea' : COLORS.pgreen,
    },
  ];

  return (
    <KeyboardAvoidingView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{height: '100%'}}
        contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.container}>
          <View>
            <View style={styles.row}>
              <View style={styles.phoneBox}>
                <TextWrapper
                  fs={18}
                  styles={{letterSpacing: 1}}
                  fw="bold"
                  color={
                    'gray'
                  }>{`${country.callingCode} ${phone}`}</TextWrapper>
              </View>
            </View>
            <Spacer />
            <Input
              inputMode="text"
              placeholder="Enter parent name"
              value={fields.parentName}
              onChangeText={e =>
                handleChangeValue({name: 'parentName', value: e})
              }
            />
            <Spacer />
            <Input
              inputMode="text"
              placeholder="Enter child name"
              value={fields.childName}
              onChangeText={e =>
                handleChangeValue({name: 'childName', value: e})
              }
            />
            <Spacer />
            <Dropdown
              defaultValue="Select child age"
              value={childAge}
              onPress={onChangeOpen}
              open={open}
              onLayout={onLayoutChange}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={btnNextStyle}
          disabled={!isActive}
          onPress={handleDemoSlots}>
          <TextWrapper
            color={COLORS.white}
            fw="700"
            styles={{letterSpacing: 1.1}}>
            Next
          </TextWrapper>
        </Pressable>
      </View>
      {open && (
        <DropdownList
          data={ageList}
          gutter={gutter}
          currentValue={childAge}
          onClose={handleOnClose}
          onChange={handleChildAge}
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: '#000',
    fontSize: 18,
    letterSpacing: 1.15,
    borderBottomWidth: 1,
    color: COLORS.black,
  },
  btnNext: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCallingCode: {
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
  },
  phoneBox: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
});
