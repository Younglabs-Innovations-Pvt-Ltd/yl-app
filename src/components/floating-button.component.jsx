import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../assets/theme/theme';
import TextWrapper from './text-wrapper.component';

const FloatingButton = ({children, bg = COLORS.white, ...otherProps}) => {
  return (
    <View style={[styles.btnWrapper]}>
      {/* <View style={styles.tooltip}>
        <View style={styles.tiphead} />
        <TextWrapper color={COLORS.black}>{'Tooltip'}</TextWrapper>
      </View> */}
      <Pressable
        style={({pressed}) => [
          styles.fbutton,
          {backgroundColor: bg, opacity: pressed ? 0.9 : 1},
        ]}
        {...otherProps}>
        {children}
      </Pressable>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  btnWrapper: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 1000,
  },
  fbutton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  tooltip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    position: 'relative',
    elevation: 4,
  },
  tiphead: {
    position: 'absolute',
    right: -12,
    top: '50%',
    borderWidth: 0,
    borderStyle: 'solid',
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderLeftWidth: 8,
    borderBottomWidth: 0,
    borderTopColor: 'red',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{rotate: '-90deg'}],
  },
});
