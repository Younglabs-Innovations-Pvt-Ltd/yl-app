import React, {useState} from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import TextWrapper from './text-wrapper.component';
import Spacer from './spacer.component';
import Icon from './icon.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from './spinner.component';
import Modal from './modal.component';

import {Select, SelectContent, SelectItem} from './selelct.component';

import {COLORS, FONTS} from '../assets/theme/theme';

import {useSelector} from 'react-redux';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import Button from './button.component';
import SuccessPopup from './success-popup.component';
import Input from './input.component';

const ADD_INQUIRY_URL =
  'https://younglabsapis-33heck6yza-el.a.run.app/admin/courses/addEnquiry';

const CustomerSupportActions = ({visible, onClose}) => {
  const [formVisible, setFormVisible] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // entries
  const [courseId, setCourseId] = useState('English handwriting');
  const [comment, setComment] = useState('Need expert guiedence in enrolling');
  const [otherOption, setOtherOption] = useState('');

  const {bookingDetails} = useSelector(joinDemoSelector);

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

  const onSelectComment = val => setComment(val);
  const onSelectCourseId = id => setCourseId(id);

  const onCloseForm = () => {
    setOtherOption('');
    setComment('Need expert guiedence in enrolling');
    setFormVisible(false);
  };

  const handleAddInquiry = async () => {
    try {
      if (!courseId || !comment) {
        setErrorMessage('Fields are required.');
        return;
      }

      const body = {
        fullName: bookingDetails?.parentName,
        phone: bookingDetails.phone,
        comment: otherOption ? otherOption : comment,
        courseId,
        source: 'HomePage',
      };

      setInquiryLoading(true);

      const response = await fetch(ADD_INQUIRY_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(await response.text());

      if (response.ok) {
        setSuccess(true);
        setInquiryLoading(false);
      }
    } catch (error) {
      console.log('ADD_INQUIRY_ERROR_CUSTOMER_SUPPORT_ACTION= ', error);
    }
  };

  const handleOnContinue = () => {
    setSuccess(false);
    setOtherOption('');
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
      <Modal visible={formVisible} onRequestClose={onCloseForm}>
        <View
          style={{
            flex: 1,
            paddingTop: 120,
            paddingHorizontal: 16,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}>
          <KeyboardAvoidingView>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                    onPress={onCloseForm}
                  />
                </View>
                <TextWrapper>Choose course</TextWrapper>
                <Select
                  defaultValue={courseId || 'Choose course'}
                  onSelect={onSelectCourseId}>
                  <SelectContent>
                    <SelectItem
                      currentValue={courseId}
                      value="English handwriting">
                      English handwriting
                    </SelectItem>
                    <SelectItem
                      currentValue={courseId}
                      value="English speaking">
                      English speaking
                    </SelectItem>
                    <SelectItem
                      currentValue={courseId}
                      value="Hindi handwriting">
                      Hindi handwriting
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
                {comment === 'Other' && (
                  <Input
                    placeholder="Enter your option"
                    value={otherOption}
                    onChangeText={e => setOtherOption(e)}
                  />
                )}
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
