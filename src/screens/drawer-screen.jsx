import React from 'react';
import {CommonActions} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Linking,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

// Screens
import HomeScreen from './home-screen';

import {useDispatch, useSelector} from 'react-redux';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {setToInitialState} from '../store/join-demo/join-demo.reducer';

import TextWrapper from '../components/text-wrapper.component';
import Icon from '../components/icon.component';
import Spacer from '../components/spacer.component';

import {COLORS} from '../assets/theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation, ...props}) => {
  const dispatch = useDispatch();
  const {bookingDetails} = useSelector(joinDemoSelector);
  const windowDimensions = useWindowDimensions();

  if (!bookingDetails) return null;

  const {phone, parentName} = bookingDetails;

  const handleChangeNumber = async () => {
    try {
      await AsyncStorage.removeItem('phone');
      await AsyncStorage.removeItem('countdown_notification');
      dispatch(setToInitialState());
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{name: 'Welcome'}],
      });

      navigation.dispatch(resetAction);
    } catch (error) {
      console.log('CHANGE_NUMBER_ERROR', error);
    }
  };

  const openInstagram = async () => {
    try {
      const instagram_url = 'https://www.instagram.com/younglabs.in/';
      await Linking.openURL(instagram_url);
    } catch (error) {
      console.log('OPEN_INSTAGRAM_URL_ERROR', error);
    }
  };

  const openFacebook = async () => {
    try {
      const facebook_url = 'https://www.facebook.com/Younglabs/';
      await Linking.openURL(facebook_url);
    } catch (error) {
      console.log('OPEN_INSTAGRAM_URL_ERROR', error);
    }
  };

  const openWhatsapp = async () => {
    let whatappUrl = '';
    const phoneNumber = '+919289029696';

    if (Platform.OS === 'android') {
      whatappUrl = `whatsapp://send?phone=${phoneNumber}`;
    } else if (Platform.OS === 'ios') {
      whatappUrl = `whatsapp://wa.me/${phoneNumber}`;
    }
    try {
      const canOpen = await Linking.canOpenURL(whatappUrl);

      if (canOpen) {
        await Linking.openURL(whatappUrl);
      }
    } catch (error) {
      console.log('join demo screen whatsapp redirect error', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={[
          styles.parentContainer,
          {height: windowDimensions.height - 94},
        ]}>
        <View style={{flex: 2}}>
          <View style={{padding: 12}}>
            <TextWrapper fs={28}>Welcome {parentName || 'guest'}</TextWrapper>
            <TextWrapper>{phone}</TextWrapper>
            <Spacer space={4} />
            <Pressable
              style={({pressed}) => [
                styles.btnChangeNumber,
                {opacity: pressed ? 0.75 : 1},
              ]}
              onPress={handleChangeNumber}>
              <TextWrapper color={COLORS.white} fs={16.5}>
                Logout
              </TextWrapper>
              <Icon name="log-out-outline" size={24} color={COLORS.white} />
            </Pressable>
          </View>
        </View>
        <View style={{flex: 0.5, justifyContent: 'flex-end'}}>
          <View style={styles.socialMediaIconsWrapper}>
            <Pressable style={styles.btnSocialMedia} onPress={openFacebook}>
              <Icon name="logo-facebook" size={30} color="blue" />
            </Pressable>
            <Pressable style={styles.btnSocialMedia} onPress={openInstagram}>
              <Icon name="logo-instagram" size={30} color={COLORS.orange} />
            </Pressable>
            <Pressable style={styles.btnSocialMedia} onPress={openWhatsapp}>
              <Icon name="logo-whatsapp" size={30} color={COLORS.pgreen} />
            </Pressable>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerType: 'front',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  btnChangeNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
  },
  btnSocialMedia: {
    width: 36,
    height: 36,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialMediaIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    gap: 8,
  },
});
