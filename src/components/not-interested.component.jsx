import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import Icon from './icon.component';
import Spacer from './spacer.component';
import TextWrapper from './text-wrapper.component';
import Collapsible from 'react-native-collapsible';
import {FONTS} from '../utils/constants/fonts';
import {markNotInterest} from '../utils/api/yl.api';
import Snackbar from 'react-native-snackbar';
import {useDispatch} from 'react-redux';
import {setAppRemark} from '../store/join-demo/join-demo.reducer';

const faqs = [
  'Did not like class',
  'Too expensive',
  'Child not free',
  'Want offline class',
  'Want in vacations',
];

const NotInterested = ({onClose, bookingDetails}) => {
  const [comment, setComment] = useState('');
  const [other, setOther] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const dispatch = useDispatch();

  const onSelectComment = payload => {
    if (payload === 'Other') {
      if (isCollapsed) {
        setIsCollapsed(false);
        inputRef.current.focus();
      } else {
        setIsCollapsed(true);
        setOther('');
      }
    }
    if (!isCollapsed) {
      setIsCollapsed(true);
    }
    setComment(payload);
  };

  const saveMarkNotInterested = async () => {
    try {
      setLoading(true);
      if (comment === 'Other' && !other) {
        setIsCollapsed(false);
        inputRef.current.focus();
        setLoading(false);
        return;
      }
      const remark = other || comment;
      const res = await markNotInterest({
        bookingId: bookingDetails.bookingId,
        comment: remark,
      });
      if (res.status === 200) {
        Snackbar.show({
          text: 'Thank you for your comment',
          textColor: COLORS.white,
          duration: Snackbar.LENGTH_SHORT,
          action: {
            text: 'CONTINUE',
            textColor: COLORS.white,
            onPress: onClose,
          },
        });
      }
      setLoading(false);
      dispatch(setAppRemark(remark));
      onClose();
    } catch (error) {
      console.log('MARK NOT INTERESTED', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Icon
        name="close-outline"
        size={26}
        color={COLORS.black}
        style={{alignSelf: 'flex-end'}}
        onPress={onClose}
      />
      <Spacer space={12} />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 6, paddingBottom: 70}}>
        {faqs.map((faq, index) => (
          <Pressable
            key={index}
            style={[
              styles.faq,
              {borderColor: faq === comment ? COLORS.pgreen : COLORS.pblue},
            ]}
            onPress={() => onSelectComment(faq)}>
            <TextWrapper fs={18}>{faq}</TextWrapper>
          </Pressable>
        ))}
        <Collapsible collapsed={isCollapsed} style={{margin: 0, padding: 0}}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Enter comment"
            selectionColor={COLORS.black}
            value={other}
            onChangeText={e => setOther(e)}
            placeholderTextColor={'gray'}
          />
        </Collapsible>
        <Pressable
          style={[
            styles.faq,
            {borderColor: comment === 'Other' ? COLORS.pgreen : COLORS.pblue},
          ]}
          onPress={() => onSelectComment('Other')}>
          <TextWrapper fs={18}>Other</TextWrapper>
        </Pressable>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={styles.button}
          onPress={saveMarkNotInterested}
          disabled={loading}>
          <TextWrapper fs={18} color={COLORS.white} ff={FONTS.signika_semiBold}>
            Submit
          </TextWrapper>
          {loading && (
            <ActivityIndicator
              size={'small'}
              color={COLORS.white}
              style={{marginLeft: 4}}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default NotInterested;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  faq: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderWidth: 0.75,
    borderRadius: 12,
  },
  input: {
    padding: 12,
    borderWidth: 0.75,
    borderRadius: 12,
    borderColor: COLORS.pblue,
    fontFamily: FONTS.roboto,
    fontSize: 18,
    color: COLORS.black,
    height: 48,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 290,
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 6,
    padding: 16,
  },
  button: {
    width: '100%',
    height: 48,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pblue,
    borderRadius: 6,
  },
});
