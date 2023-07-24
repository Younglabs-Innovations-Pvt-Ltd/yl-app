import React from 'react';
import Icon from './icon.component';
import {COLORS} from '../assets/theme/theme';

const BackButton = props => {
  return (
    <Icon name="arrow-back-outline" size={24} color={COLORS.black} {...props} />
  );
};

export default BackButton;
