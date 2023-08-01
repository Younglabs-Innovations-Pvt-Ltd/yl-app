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

import {COLORS} from '../assets/theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation, ...props}) => {
  const dispatch = useDispatch();
  const {bookingDetails} = useSelector(joinDemoSelector);
  const windowDimensions = useWindowDimensions();

  if (!bookingDetails) return null;

  const {phone, parentName, bookingId} = bookingDetails;

  const handleChangeNumber = async () => {
    try {
      await AsyncStorage.removeItem('phone');
      await AsyncStorage.removeItem('countdown_notification');
      await AsyncStorage.removeItem('bookingid');
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

  const fullName = parentName.slice(0, 1).toUpperCase() + parentName.slice(1);

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={[
          styles.parentContainer,
          {height: windowDimensions.height - 94},
        ]}>
        <View style={{flex: 2}}>
          <View style={{padding: 12}}>
            <TextWrapper fs={28}>Welcome {fullName || 'Guest'}</TextWrapper>
            <TextWrapper fs={18}>{phone}</TextWrapper>
          </View>
        </View>
        <View style={{flex: 0.5, justifyContent: 'flex-end'}}>
          <View>
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
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#eee',
              paddingVertical: 2,
            }}>
            <Pressable
              style={({pressed}) => [
                styles.btnChangeNumber,
                {backgroundColor: pressed ? '#eaeaea' : 'transparent'},
              ]}
              onPress={handleChangeNumber}>
              <TextWrapper color={COLORS.black} fs={16.5}>
                Logout
              </TextWrapper>
              <Icon name="log-out-outline" size={24} color={COLORS.black} />
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
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingRight: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 16,
  },
});
