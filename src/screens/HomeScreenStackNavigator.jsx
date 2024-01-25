import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import MainWelcomeScreen from './MainWelcomeScreen';
import CourseDetailsScreen from './CourseDetailScreen';
import ViewAllCourses from './ViewAllCourses';
import UserProfile from './UserProfile';
import {useSelector} from 'react-redux';
import { SCREEN_NAMES } from '../utils/constants/screen-names';
import Payment from './payment.screen';

const Stack = createStackNavigator();
const HomeScreenStackNavigator = () => {
  const {bgColor, textColors} = useSelector(state => state.appTheme);
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="MainWelcomeScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: bgColor,
            borderBottomWidth: 1,
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
        <Stack.Screen
          name="CourseDetailScreen"
          component={CourseDetailsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AllCoursesScreen"
          component={ViewAllCourses}
          options={({route}) => ({
            title: route.params.heading || 'All Courses',
          })}
        />
        <Stack.Screen
          name="UserProfileScreen"
          component={UserProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={SCREEN_NAMES.PAYMENT}
          component={Payment}
          options={{
            headerTitle: 'Checkout',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeScreenStackNavigator;
