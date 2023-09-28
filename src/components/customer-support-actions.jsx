import React from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';

import TextWrapper from './text-wrapper.component';
import Spacer from './spacer.component';
import Icon from './icon.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from './spinner.component';
import Modal from './modal.component';

import {Select, SelectContent, SelectItem} from './selelct.component';

import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';

import {useDispatch, useSelector} from 'react-redux';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {csaSelector} from '../store/customer-support-action/selector';

import {
  setFormVisible,
  addInquiryStart,
  setOtherOption,
  setComment,
  setCourseId,
  resetState,
} from '../store/customer-support-action/reducer';

import SuccessPopup from './success-popup.component';
import Input from './input.component';

import {i18nContext} from '../context/lang.context';

import {getWhatsappRedirectUrl} from '../utils/redirect-whatsapp';

const {width: deviceWidth} = Dimensions.get('window');

const CustomerSupportActions = ({visible, onClose}) => {
  if (!visible) return null;

  const {localLang} = i18nContext();

  const dispatch = useDispatch();

  const {
    formVisible,
    message,
    success,
    loading,
    courseId,
    comment,
    otherOption,
  } = useSelector(csaSelector);

  const {bookingDetails} = useSelector(joinDemoSelector);

  const handleShowFormVisible = () => dispatch(setFormVisible(true));

  const openWhatsapp = async () => {
    const text = 'I would like to know more about your courses';
    const whatappUrl = getWhatsappRedirectUrl(text);
    try {
      await Linking.openURL(whatappUrl);
    } catch (error) {
      console.log('join demo screen whatsapp redirect error', error);
    }
  };

  // Set other option
  const onChangeOtherOptions = e => {
    dispatch(setOtherOption(e));
  };

  // Set comment
  const onSelectComment = val => {
    dispatch(setComment(val));
  };

  // Set course id
  const onSelectCourseId = id => {
    dispatch(setCourseId(id));
  };

  // close form
  const onCloseForm = () => {
    dispatch(resetState());
  };

  // Save inquiry
  const handleAddInquiry = async () => {
    dispatch(addInquiryStart({courseId, comment, otherOption, bookingDetails}));
  };

  // Continue, close form and reset state
  const handleOnContinue = () => {
    dispatch(resetState());
  };

  // UI Constants
  const isTablet = deviceWidth > 540;
  let TABLE_MODAL_CONTENT_PADDING = {};
  let MODAL_WRAPPER_PADDING_TOP = 120;

  if (isTablet) {
    TABLE_MODAL_CONTENT_PADDING = {
      paddingHorizontal: 20,
      paddingVertical: 40,
    };
    MODAL_WRAPPER_PADDING_TOP = 200;
  }

  return (
    <>
      <View style={styles.customerSupportActions}>
        <Modal visible={visible} onRequestClose={onClose}>
          <Pressable style={styles.container} onPress={onClose}>
            <View style={styles.actionsContainer}>
              <Pressable style={styles.btnCta} onPress={handleShowFormVisible}>
                <View style={styles.btnCtaContentContainer}>
                  <TextWrapper color={COLORS.black}>
                    {localLang.CSACallbackRequest}
                  </TextWrapper>
                </View>
                <MIcon name="phone-in-talk" size={32} color={COLORS.pblue} />
              </Pressable>
              <Spacer space={4} />
              <Pressable style={styles.btnCta} onPress={openWhatsapp}>
                <View style={styles.btnCtaContentContainer}>
                  <TextWrapper color={COLORS.black}>
                    {localLang.CSAChatWithUs}
                  </TextWrapper>
                </View>
                <Icon name="logo-whatsapp" size={32} color={COLORS.pgreen} />
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
      <Modal visible={formVisible} onRequestClose={onCloseForm}>
        <View
          style={[
            styles.modalWrapper,
            {paddingTop: MODAL_WRAPPER_PADDING_TOP},
          ]}>
          <KeyboardAvoidingView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.modalContent, TABLE_MODAL_CONTENT_PADDING]}>
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
                    onChangeText={onChangeOtherOptions}
                  />
                )}
                {message && (
                  <TextWrapper fs={14} color={COLORS.pred}>
                    {message}
                  </TextWrapper>
                )}
                <Spacer />
                <Pressable
                  style={[
                    styles.btnSubmit,
                    {opacity: !courseId || !comment ? 0.5 : 1},
                  ]}
                  onPress={handleAddInquiry}
                  disabled={!courseId || !comment ? true : false}>
                  <TextWrapper fs={18} color={COLORS.white}>
                    Submit
                  </TextWrapper>
                </Pressable>
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
      <Modal visible={loading}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner />
        </View>
      </Modal>
    </>
  );
};

export default CustomerSupportActions;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'},
  customerSupportActions: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  actionsContainer: {
    position: 'absolute',
    right: 12,
    bottom: 68,
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
  btnCtaContentContainer: {
    paddingVertical: 8,
    borderRadius: 4,
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
  btnSubmit: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pgreen,
    borderRadius: 4,
  },
  modalWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 20,
    maxWidth: 380,
    width: '100%',
    alignSelf: 'center',
    elevation: 2,
  },
});
