import {Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ModalComponent from '../modal.component';
import {COLORS} from '../../utils/constants/colors';
import {useSelector} from 'react-redux';
import {FONTS} from '../../utils/constants/fonts';

const Update = ({visible, identifier}) => {
  const {colorYlMain, textColors} = useSelector(state => state.appTheme);

  const redirectToAppStore = async () => {
    try {
      const url = `itms-apps://itunes.apple.com/app/view?id=${identifier}`;
      const supported = await Linking.canOpenURL(url);
      console.log('supported', supported);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalComponent visible={visible}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.heading}>App Update Required!</Text>
          <Text style={[styles.subheading, {color: textColors.textSecondary}]}>
            We have added new features and fix some bugs to make your experience
            seamless.
          </Text>
          <Pressable
            onPress={redirectToAppStore}
            style={({pressed}) => [
              styles.btnUpdate,
              {backgroundColor: colorYlMain, opacity: pressed ? 0.8 : 1},
            ]}>
            <Text style={{fontSize: 15, color: COLORS.white}}>Update App</Text>
          </Pressable>
        </View>
      </View>
    </ModalComponent>
  );
};

export default Update;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  box: {
    width: 280,
    shadowColor: '#ccc', // Adjust the shadow color as needed
    shadowOffset: {width: 3, height: 3}, // Adjust the offset for shadow position
    shadowOpacity: 0.5, // Control the transparency of the shadow
    shadowRadius: 4,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 6,
    padding: 20,
  },
  heading: {
    fontFamily: FONTS.primaryFont,
    fontSize: 17,
    color: COLORS.black,
  },
  subheading: {
    fontFamily: FONTS.secondaryFont,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  btnUpdate: {
    width: 200,
    borderRadius: 6,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: COLORS.pblue, // Adjust the shadow color as needed
    shadowOffset: {width: 3, height: 3}, // Adjust the offset for shadow position
    shadowOpacity: 0.5, // Control the transparency of the shadow
    shadowRadius: 4,
  },
});
