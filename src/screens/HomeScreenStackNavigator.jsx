import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainWelcomeScreen from './MainWelcomeScreen';
import CourseDetailsScreen from './CourseDetailScreen';
import {useSelector} from 'react-redux';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import Payment from './payment.screen';

const Stack = createStackNavigator();
const HomeScreenStackNavigator = () => {
  const {bgColor, textColors} = useSelector(state => state.appTheme);
  return (
    <Stack.Navigator
      initialRouteName="MainWelcomeScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: bgColor,
          borderColor: textColors.textSecondary,
          elevation: 1.12,
        },
        headerTintColor: textColors.textSecondary,
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: 18,
        },
      }}>
      <Stack.Screen
        name="MainWelcomeScreen"
        component={MainWelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailsScreen} />
      <Stack.Screen
        name={SCREEN_NAMES.PAYMENT}
        component={Payment}
        options={{
          headerTitle: 'Checkout',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeScreenStackNavigator;
