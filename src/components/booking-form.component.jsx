import React, {useState, useMemo} from 'react';
import {StyleSheet, Pressable, View, ScrollView} from 'react-native';

import TextWrapper from './text-wrapper.component';
import Spacer from './spacer.component';
import Input from './input.component';
import {Dropdown, DropdownList} from './dropdown.component';
import {COLORS} from '../utils/constants/colors';
import {localStorage} from '../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../utils/constants/local-keys';

const ageList = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const INITIAL_sTATE = {
  parentName: '',
  childName: '',
};

const BookingForm = ({goToNextSlide}) => {
  const [gutter, setGutter] = useState(0);
  const [open, setOpen] = useState(false);
  const [childAge, setChildAge] = useState(null);
  const [fields, setFields] = useState(INITIAL_sTATE);

  const PHONE = localStorage.getNumber(LOCAL_KEYS.PHONE);

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
    const formFields = {...fields, phone: PHONE, childAge};

    goToNextSlide(formFields);
  };

  const handleChildAge = ({childAge}) => {
    setChildAge(childAge);
  };

  const onChangeOpen = () => setOpen(true);

  const btnNextStyle = ({pressed}) => [
    styles.btnNext,
    {
      opacity: pressed ? 0.9 : 1,
      backgroundColor: !isActive ? '#eaeaea' : COLORS.pblue,
    },
  ];

  return (
    <React.Fragment>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingHorizontal: 8, paddingTop: 8}}>
        <View style={{flex: 1}}>
          <View style={styles.row}>
            <View style={styles.phoneBox}>
              <TextWrapper
                fs={18}
                styles={{letterSpacing: 1}}
                fw="bold"
                color={'gray'}>{`+91 ${PHONE}`}</TextWrapper>
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
            onChangeText={e => handleChangeValue({name: 'childName', value: e})}
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
      </ScrollView>

      <View style={{padding: 8}}>
        <Pressable
          style={btnNextStyle}
          disabled={!isActive}
          onPress={handleDemoSlots}>
          <TextWrapper
            color={isActive ? COLORS.white : '#434a52'}
            fw="700"
            styles={{letterSpacing: 1.1}}>
            Continue
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
    </React.Fragment>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  btnCallingCode: {
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
