import React from 'react';
import {StyleSheet, View, Modal} from 'react-native';

export default ({children, visible, bg = 'transparent'}) => {
  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View style={[styles.modal, {backgroundColor: bg}]}>{children}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
