import React, {useState, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import {COLORS} from '../assets/theme/theme';

import {useDispatch, useSelector} from 'react-redux';
import CountryList from '../components/country-list.component';
import {isValidNumber} from '../utils/isValidNumber';
import Spinner from '../components/spinner.component';
import {DropdownList, Dropdown} from '../components/dropdown.component';
import Input from '../components/input.component';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import Modal from '../components/modal.component';

import {
  setTimezone,
  startFetchingIpData,
  setIpDataLoadingState,
} from '../store/book-demo/book-demo.reducer';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import Center from '../components/center.component';

const ageList = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const INITIAL_sTATE = {
  name: '',
  childAge: null,
  phone: '',
  childName: '',
};

const BookDemoScreen = ({route, navigation}) => {
  const {phone} = route.params;
  const [gutter, setGutter] = useState(0);
  const [open, setOpen] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    childAge: null,
    phone: phone || '',
    childName: '',
  });
  const [errorMessage, setErrorMessage] = useState({
    phone: '',
    name: '',
    childAge: '',
    childName: '',
  });
  const [visible, setVisible] = useState(false);
  const [country, setCountry] = useState({callingCode: ''});

  const dispatch = useDispatch();

  const isActive = useMemo(() => {
    if (
      !formFields.childAge ||
      !formFields.name ||
      !formFields.phone ||
      !formFields.childName
    ) {
      return false;
    }

    return true;
  }, [
    formFields.childAge,
    formFields.name,
    formFields.phone,
    formFields.childName,
  ]);

  const {
    ipData,
    loading: {ipDataLoading},
  } = useSelector(bookDemoSelector);

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  useEffect(() => {
    if (ipData) {
      setCountry({
        callingCode: ipData.calling_code,
        countryCode: {cca2: ipData.country_code2},
      });
    }
  }, [ipData]);

  useEffect(() => {
    if (ipData) {
      const tz = ipData.time_zone.offset + ipData.time_zone.dst_savings;
      dispatch(setTimezone(tz));
    }
  }, [ipData]);

  const handleChangeValue = item => {
    setFormFields(preValue => ({...preValue, ...item}));
  };

  const handleOnClose = () => setOpen(false);

  const handleDemoSlots = async () => {
    const {childAge, name, phone} = formFields;

    if (!childAge || !name || !phone) {
      setErrorMessage({
        ...errorMessage,
        name: 'Fields are required.',
        childAge: 'Fields are required.',
        phone: 'Fields are required.',
      });
      return;
    }

    if (!childAge) {
      setErrorMessage({...errorMessage, childAge: 'Select child age'});
      return;
    } else if (!name) {
      setErrorMessage({...errorMessage, name: 'Please enter your name'});
      return;
    } else if (!phone) {
      setErrorMessage({...errorMessage, phone: 'Please enter phone number'});
      return;
    }

    const isValidPhone = isValidNumber(phone, country.countryCode.cca2);
    if (!isValidPhone) {
      setErrorMessage({...errorMessage, phone: 'Please enter a valid number'});
      return;
    }

    navigation.navigate('BookDemoSlots', {formFields, country});
  };

  const handleSelectCountry = country => {
    let code = '';
    if (country.callingCode?.root && country.callingCode?.suffixes.length) {
      code = country.callingCode.root.concat(country.callingCode.suffixes[0]);
    }
    setCountry({
      callingCode: code,
      countryCode: {cca2: country.countryCode.cca2},
    });
    setVisible(false);
  };

  const onCloseBottomSheet = () => setVisible(false);

  return (
    <KeyboardAvoidingView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{height: '100%'}}>
        <View style={styles.container}>
          <View>
            <Input
              inputMode="text"
              placeholder="Enter parent name"
              value={formFields.name}
              onChangeText={name => handleChangeValue({name})}
            />
            {errorMessage.name && (
              <TextWrapper fs={14} color={COLORS.pred}>
                {errorMessage.name}
              </TextWrapper>
            )}
            <Spacer />
            <Input
              inputMode="text"
              placeholder="Enter child name"
              value={formFields.childName}
              onChangeText={childName => handleChangeValue({childName})}
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
              <TextInput
                placeholder="Enter your phone number"
                style={styles.input}
                selectionColor={COLORS.black}
                value={formFields.phone}
                onChangeText={phone => handleChangeValue({phone})}
                inputMode="numeric"
                placeholderTextColor={'gray'}
              />
            </View>
            {errorMessage.phone && (
              <TextWrapper fs={14} color={COLORS.pred}>
                {errorMessage.phone}
              </TextWrapper>
            )}

            <TextWrapper fs={14} color="gray">
              Please enter valid whatsapp number to receive further class
              details
              {/* <Icon name="logo-whatsapp" size={18} color={COLORS.pgreen} /> */}
            </TextWrapper>
            <Spacer />
            <Dropdown
              defaultValue="Select child age"
              value={formFields.childAge}
              onPress={() => setOpen(true)}
              open={open}
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
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={({pressed}) => [
            styles.btnNext,
            {
              opacity: pressed ? 0.8 : 1,
              backgroundColor: !isActive ? '#eaeaea' : COLORS.pgreen,
            },
          ]}
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
      <CountryList
        visible={visible}
        onClose={onCloseBottomSheet}
        onSelect={handleSelectCountry}
      />
      {open && (
        <DropdownList
          data={ageList}
          gutter={gutter}
          currentValue={formFields.childAge}
          onClose={handleOnClose}
          onChange={handleChangeValue}
        />
      )}
      <Modal
        visible={ipDataLoading}
        onRequestClose={() => setIpDataLoadingState(false)}>
        <Center>
          <Spinner />
        </Center>
      </Modal>
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
});
