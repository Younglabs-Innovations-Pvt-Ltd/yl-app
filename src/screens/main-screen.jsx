import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Tabbar from '../components/tabbar-component';
import DrawerScreen from './drawer-screen';

import {COLORS} from '../assets/theme/theme';

import {useDispatch} from 'react-redux';
import {setDemoBookingId} from '../store/join-demo/join-demo.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

function ContactScreen() {
  return <></>;
}

const MainScreen = ({route}) => {
  const data = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor(COLORS.pgreen);
    StatusBar.setBarStyle('light-content');
  }, []);

  useEffect(() => {
    if (!data) return;

    // If not phone exists already
    // only then set booking id
    const checkForPhone = async () => {
      try {
        const isPhoneExists = await AsyncStorage.getItem('phone');
        if (!isPhoneExists) {
          dispatch(setDemoBookingId(data.bookingId));
        }
      } catch (error) {
        console.log('CHECK_FOR_PHONE_MAIN_SCREEN', error);
      }
    };

    checkForPhone();
  }, []);

  return (
    <Tab.Navigator tabBar={props => <Tabbar {...props} />}>
      <Tab.Screen
        name="Drawer"
        component={DrawerScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
};

export default MainScreen;
