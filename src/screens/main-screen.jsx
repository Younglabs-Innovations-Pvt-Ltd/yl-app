import React from 'react';
import {Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Tabbar from '../components/tabbar-component';
import HomeScreen from './home-screen';

const Tab = createBottomTabNavigator();

function ContactScreen() {
  return <></>;
}

function AccountScreen() {
  return (
    <View>
      <Text>Account Screen</Text>
    </View>
  );
}

const MainScreen = () => {
  return (
    <Tab.Navigator tabBar={props => <Tabbar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
};

export default MainScreen;
