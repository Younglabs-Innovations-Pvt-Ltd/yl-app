import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Tabbar from '../components/tabbar-component';
import DrawerScreen from './drawer-screen';

import {i18nContext} from '../context/lang.context';
import UserProfile from './UserProfile';
import CourseScreenNavigator from './course-screen-navigator';

const Tab = createBottomTabNavigator();

function ContactScreen() {
  return <></>;
}

function ShareScreen() {
  return <></>;
}

const MainScreen = ({route}) => {
  const data = route.params;
  const {localLang} = i18nContext();

  return (
    <Tab.Navigator tabBar={props => <Tabbar {...props} />}>
      <Tab.Screen
        name="Drawer"
        component={DrawerScreen}
        options={{
          headerShown: false,
          tabBarLabel: localLang.tabNavHome,
        }}
        initialParams={{data: data.data}}
      />
      <Tab.Screen
        name="Course"
        component={CourseScreenNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'My Courses',
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
        options={{tabBarLabel: 'Account', headerShown: false}}
        component={UserProfile}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;
