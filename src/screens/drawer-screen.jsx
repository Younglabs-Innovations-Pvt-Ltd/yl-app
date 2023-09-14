import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Screens
import HomeScreen from './home-screen';

import CustomDrawerContent from '../components/custom-drawer.component';

import {COLORS} from '../utils/constants/colors';

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
        component={HomeScreen}
        options={{sceneContainerStyle: {backgroundColor: COLORS.white}}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;
