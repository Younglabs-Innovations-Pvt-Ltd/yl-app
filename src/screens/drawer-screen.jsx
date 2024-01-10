import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Screens
import HomeScreen from './home-screen';

import CustomDrawerContent from '../components/custom-drawer.component';

import {COLORS} from '../utils/constants/colors';
import HomeScreenStackNavigator from './HomeScreenStackNavigator';

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerType: 'front',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={HomeScreenStackNavigator}
        options={{sceneContainerStyle: {backgroundColor: COLORS.white}}}
      />
      {/* <Drawer.Screen
        name="MainWelcomeScreen"
        component={MainWelcomeScreen}
        options={{sceneContainerStyle: {backgroundColor: COLORS.white}}}
      /> */}
    </Drawer.Navigator>
  );
};

export default DrawerScreen;
