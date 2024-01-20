import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Tabbar from '../components/tabbar-component';
import DrawerScreen from './drawer-screen';

import {COLORS} from '../utils/constants/colors';

import {useDispatch} from 'react-redux';
import {setDemoBookingId} from '../store/join-demo/join-demo.reducer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOCAL_KEYS} from '../utils/constants/local-keys';
import {localStorage} from '../utils/storage/storage-provider';

import {i18nContext} from '../context/lang.context';
import UserProfile from './UserProfile';

const Tab = createBottomTabNavigator();

function ContactScreen() {
  return <></>;
}

function ShareScreen() {
  return <></>;
}

function CourseScreen() {
  return <></>;
}

const MainScreen = ({route}) => {
  const data = route.params;
  const dispatch = useDispatch();
  const {localLang} = i18nContext();

  // useEffect(() => {
  //   StatusBar.setHidden(false);
  //   StatusBar.setBackgroundColor(COLORS.pgreen);
  //   StatusBar.setBarStyle('light-content');
  // }, []);

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
  const checkForPhone = () => {
    try {
      const isPhoneExists = localStorage.getNumber(LOCAL_KEYS.PHONE);
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
        name="Course"
        component={CourseScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Course',
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
      <Tab.Screen
        name={'Account'}
        options={{tabBarLabel: "Account" , headerShown: false}}
        component={UserProfile}

      />
    </Tab.Navigator>
  );
};

export default MainScreen;
