import React from 'react';
import {Modal} from 'react-native';

export default ({
  children,
  transparent = true,
  animationType = 'none',
  ...props
}) => {
  return (
    <Modal transparent={transparent} animationType={animationType} {...props}>
      {children}
    </Modal>
  );
};
