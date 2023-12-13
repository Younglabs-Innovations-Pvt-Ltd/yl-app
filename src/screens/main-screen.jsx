import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Tabbar from '../components/tabbar-component';
import DrawerScreen from './drawer-screen';

import {COLORS} from '../utils/constants/colors';

import {useDispatch} from 'react-redux';
import {setDemoBookingId} from '../store/join-demo/join-demo.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../utils/constants/local-keys';

import {i18nContext} from '../context/lang.context';

const Tab = createBottomTabNavigator();

function ContactScreen() {
  return <></>;
}

function ShareScreen() {
  return <></>;
}

const MainScreen = ({route}) => {
  const data = route.params;
  const dispatch = useDispatch();
  const {localLang} = i18nContext();

  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor(COLORS.pgreen);
    StatusBar.setBarStyle('light-content');
  }, []);

  useEffect(() => {
    if (!data) return;

    checkForPhone();
  }, []);

  /**
   * @author Shobhit
   * @since 20/09/2023
   * @description
   * Check is phone number exists in local storage
   * If it does not exist only then set booking id by dispatching an action
   */
  const checkForPhone = async () => {
    try {
      const isPhoneExists = await AsyncStorage.getItem(LOCAL_KEYS.PHONE);
      if (!isPhoneExists) {
        dispatch(setDemoBookingId(data.bookingId));
      }
    } catch (error) {
      console.log('CHECK_FOR_PHONE_MAIN_SCREEN', error);
    }
  };

  return (
    <Tab.Navigator tabBar={props => <Tabbar {...props} />}>
      <Tab.Screen
        name="Drawer"
        component={DrawerScreen}
        options={{
          headerShown: false,
          tabBarLabel: localLang.tabNavHome,
        }}
      />
      <Tab.Screen
        name="Share"
        component={ShareScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Share',
        }}
      />
      <Tab.Screen
        name={'Contact'}
        options={{tabBarLabel: localLang.tabNavContact}}
        component={ContactScreen}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;
