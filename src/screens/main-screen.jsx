import React, {useEffect} from 'react';
import {Text, View, StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Tabbar from '../components/tabbar-component';
import DrawerScreen from './drawer-screen';

import {COLORS} from '../assets/theme/theme';

const Tab = createBottomTabNavigator();

function ContactScreen() {
  return <></>;
}

const MainScreen = () => {
  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor(COLORS.pgreen);
    StatusBar.setBarStyle('light-content');
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
