import React from 'react';
import {StyleSheet, View, Modal, Pressable} from 'react-native';
import Icon from './icon.component';
import TextWrapper from './text-wrapper.component';
import Spacer from './spacer.component';
// import Button from './button.component';
import {COLORS} from '../utils/constants/colors';

const SuccessPopup = ({open, msg, onContinue}) => {
  return (
    <Modal transparent={true} animationType="none" visible={open}>
      <View style={styles.container}>
        <View style={styles.popup}>
          <Icon
            name="checkmark"
            size={54}
            color={COLORS.pgreen}
            style={{alignSelf: 'center'}}
          />
          <TextWrapper styles={{textAlign: 'center'}}>{msg}</TextWrapper>
          <Spacer />
          <View>
            <Pressable
              bg={COLORS.pblue}
              textColor={COLORS.white}
              rounded={4}
              onPress={onContinue}>
              Continue
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessPopup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    width: 324,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 16,
    elevation: 4,
  },
});
