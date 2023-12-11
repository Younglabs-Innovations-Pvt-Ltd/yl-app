import React, {useRef, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import Icon from './icon.component';
import Spacer from './spacer.component';
import TextWrapper from './text-wrapper.component';
import Collapsible from 'react-native-collapsible';
import {FONTS} from '../utils/constants/fonts';
import Button from './button.component';
import {markNotInterest} from '../utils/api/yl.api';
import Snackbar from 'react-native-snackbar';

const faqs = [
  'Class quality was not good enough',
  'Teacher was not good',
  'Unable to join the class',
];

const NotInterested = ({onClose, bookingDetails}) => {
  const [comment, setComment] = useState('');
  const [other, setOther] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const {leadId, phone, parentName} = bookingDetails;

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
        leadId,
        phone,
        name: parentName,
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
        contentContainerStyle={{gap: 6}}>
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
        <Button
          loading={loading}
          onPress={saveMarkNotInterested}
          textSize={18}
          textColor={COLORS.white}
          bg={COLORS.pgreen}
          rounded={6}>
          Submit
        </Button>
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
});
