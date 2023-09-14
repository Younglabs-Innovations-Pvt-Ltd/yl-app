import React from 'react';
import Icon from './icon.component';
import {COLORS} from '../utils/constants/colors';

const BackButton = props => {
  return (
    <Icon name="arrow-back-outline" size={24} color={COLORS.black} {...props} />
  );
};

export default BackButton;
