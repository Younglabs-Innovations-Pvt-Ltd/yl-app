import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Screens
import HomeScreen from './home-screen';

import CustomDrawerContent from '../components/custom-drawer.component';

import {COLORS} from '../utils/constants/colors';

const Drawer = createDrawerNavigator();

const DrawerScreen = ({route}) => {
  const data = route.params;
  console.log('drawerData', data);
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
        initialParams={{data: data.data}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;
