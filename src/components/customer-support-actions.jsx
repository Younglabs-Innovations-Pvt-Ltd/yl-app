import React, {useState, useEffect} from 'react';
import {StyleSheet, Pressable, View, TextInput, Linking} from 'react-native';

import TextWrapper from './text-wrapper.component';
import Spacer from './spacer.component';
import Input from './input.component';
import Icon from './icon.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from './spinner.component';
import Modal from './modal.component';

import {Select, SelectContent, SelectItem} from './selelct.component';

import {COLORS, FONTS} from '../assets/theme/theme';

import {useDispatch, useSelector} from 'react-redux';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import Button from './button.component';
import SuccessPopup from './success-popup.component';
import {isValidNumber} from '../utils/isValidNumber';
import CountryList from './country-list.component';

const ADD_INQUIRY_URL =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/courses/addEnquiry';

const CustomerSupportActions = ({visible, onClose}) => {
  const [formVisible, setFormVisible] = useState(false);
  const [bottomModalVisible, setBottomModalVisible] = useState(false);
  const [country, setCountry] = useState({callingCode: ''});
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [validPhone, setValidPhone] = useState(false);

  // entries
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState('English handwriting');
  const [comment, setComment] = useState('Need expert guiedence in enrolling');

  const {ipData} = useSelector(bookDemoSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!formVisible) return;

    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [formVisible, ipData]);

  useEffect(() => {
    if (ipData) {
      setCountry({
        callingCode: ipData.calling_code,
        countryCode: {cca2: ipData.country_code2},
      });
    }
  }, [ipData]);

  const handleShowFormVisible = () => setFormVisible(true);

  const openWhatsapp = async () => {
    let whatappUrl = '';
    const phoneNumber = '+919289029696';

    if (Platform.OS === 'android') {
      whatappUrl = `whatsapp://send?phone=${phoneNumber}&text=I would like to know more about your courses`;
    } else if (Platform.OS === 'ios') {
      whatappUrl = `whatsapp://wa.me/${phoneNumber}&text=I would like to know more about your courses`;
    }
    try {
      const canOpen = await Linking.canOpenURL(whatappUrl);

      if (canOpen) {
        await Linking.openURL(whatappUrl);
      }
    } catch (error) {
      console.log('join demo screen whatsapp redirect error', error);
    }
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
    setBottomModalVisible(false);
  };

  const onSelectComment = val => setComment(val);
  const onSelectCourseId = id => setCourseId(id);

  const handleAddInquiry = async () => {
    try {
      if (!courseId || !phone || !comment) {
        setErrorMessage('Fields are required.');
        return;
      }

      const body = {
        fullName,
        phone,
        comment,
        courseId,
        source: 'HomePage',
      };

      const isValidPhone = await isValidNumber(phone, country.countryCode.cca2);
      if (!isValidPhone) {
        setValidPhone(true);
        return;
      }

      setInquiryLoading(true);

      const response = await fetch(ADD_INQUIRY_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setSuccess(true);
        setInquiryLoading(false);
        setValidPhone(false);
      }
    } catch (error) {
      console.log('ADD_INQUIRY_ERROR_CUSTOMER_SUPPORT_ACTION= ', error);
    }
  };

  const handleOnContinue = () => {
    setSuccess(false);
    setPhone('');
    setFullName('');
    setComment('Need expert guiedence in enrolling');
    setCourseId('English handwriting');
    if (errorMessage) setErrorMessage('');
  };

  return (
    <>
      <View style={styles.customerSupportActions}>
        <Modal visible={visible} onRequestClose={onClose}>
          <Pressable
            style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}
            onPress={onClose}>
            <View
              style={{
                position: 'absolute',
                right: 12,
                bottom: 68,
              }}>
              <Pressable style={styles.btnCta} onPress={handleShowFormVisible}>
                <View
                  style={{
                    paddingVertical: 8,
                    borderRadius: 4,
                  }}>
                  <TextWrapper color={COLORS.black}>
                    Request callback
                  </TextWrapper>
                </View>
                <MIcon name="phone-in-talk" size={32} color={COLORS.pblue} />
              </Pressable>
              <Spacer space={4} />
              <Pressable style={styles.btnCta} onPress={openWhatsapp}>
                <View
                  style={{
                    paddingVertical: 8,
                    borderRadius: 4,
                  }}>
                  <TextWrapper color={COLORS.black}>Chat with us</TextWrapper>
                </View>
                <Icon name="logo-whatsapp" size={32} color={COLORS.pgreen} />
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
      <Modal visible={formVisible}>
        <View
          style={{
            flex: 1,
            paddingTop: 120,
            paddingHorizontal: 16,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 6,
              paddingHorizontal: 12,
              paddingVertical: 20,
              maxWidth: 346,
              width: '100%',
              alignSelf: 'center',
              elevation: 2,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <TextWrapper>Please fill your details</TextWrapper>
              </View>
              <Icon
                name="close-outline"
                color={COLORS.black}
                size={24}
                onPress={() => setFormVisible(false)}
              />
            </View>
            <View style={{paddingTop: 20}}>
              <Input
                placeholder="Enter Full Name"
                inputMode="text"
                value={fullName}
                onChangeText={name => setFullName(name)}
              />
              <View
                style={{
                  flexDirection: 'row',
                  gap: 4,
                  marginTop: 8,
                }}>
                <Pressable
                  style={{
                    borderBottomWidth: 1,
                    borderColor: COLORS.black,
                    paddingHorizontal: 8,
                    justifyContent: 'center',
                  }}
                  onPress={() => setBottomModalVisible(true)}>
                  <TextWrapper>{country.callingCode}</TextWrapper>
                </Pressable>
                <TextInput
                  placeholder="Phone number"
                  style={styles.input}
                  selectionColor={COLORS.black}
                  inputMode="numeric"
                  value={phone}
                  onChangeText={phone => setPhone(phone)}
                />
              </View>
              {validPhone && (
                <TextWrapper color={COLORS.pred} fs={14}>
                  Please enter a valid number
                </TextWrapper>
              )}
              <Spacer space={4} />
            </View>
            <TextWrapper>Choose course</TextWrapper>
            <Select
              defaultValue={courseId || 'Choose course'}
              onSelect={onSelectCourseId}>
              <SelectContent>
                <SelectItem currentValue={courseId} value="English handwriting">
                  English handwriting
                </SelectItem>
                <SelectItem currentValue={courseId} value="English speaking">
                  English speaking
                </SelectItem>
                <SelectItem currentValue={courseId} value="Hindi handwriting">
                  Hindi handwriting
                </SelectItem>
                <SelectItem currentValue={courseId} value="other">
                  other
                </SelectItem>
              </SelectContent>
            </Select>
            <Spacer space={4} />
            <TextWrapper>Choose an option</TextWrapper>
            <Select
              defaultValue={comment || 'choose an option'}
              onSelect={onSelectComment}>
              <SelectContent>
                <SelectItem
                  currentValue={comment}
                  value={'Need expert guiedence in enrolling'}>
                  Need expert guiedence in enrolling
                </SelectItem>
                <SelectItem
                  currentValue={comment}
                  value={'Need group batch prices and details'}>
                  Need group batch prices and details
                </SelectItem>
                <SelectItem
                  currentValue={comment}
                  value={'Need individual batch prices and details'}>
                  Need individual batch prices and details
                </SelectItem>
                <SelectItem
                  currentValue={comment}
                  value={'Discuss available offers and discounts'}>
                  Discuss available offers and discounts
                </SelectItem>
                <SelectItem currentValue={comment} value={'Other'}>
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            {errorMessage && (
              <TextWrapper color={COLORS.pred} fs={14}>
                {errorMessage}
              </TextWrapper>
            )}
            <Spacer />
            <Button
              loading={inquiryLoading}
              bg={COLORS.pgreen}
              textColor={COLORS.white}
              rounded={4}
              onPress={handleAddInquiry}>
              Submit
            </Button>
          </View>
        </View>
      </Modal>
      <CountryList
        visible={bottomModalVisible}
        onClose={() => setBottomModalVisible(false)}
        onSelect={val => handleSelectCountry(val)}
      />
      <SuccessPopup
        open={success}
        msg="We will call you soon"
        onContinue={handleOnContinue}
      />
      <Modal visible={inquiryLoading}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner />
        </View>
      </Modal>
    </>
  );
};

export default CustomerSupportActions;

const styles = StyleSheet.create({
  customerSupportActions: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  btnCustomerSupport: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    elevation: 4,
  },
  btnCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 6,
    elevation: 1,
  },
  flag: {
    width: 24,
    height: 24,
  },
  listItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#000',
    fontSize: 18,
    letterSpacing: 1.15,
    fontFamily: FONTS.roboto,
    color: COLORS.black,
  },
});
