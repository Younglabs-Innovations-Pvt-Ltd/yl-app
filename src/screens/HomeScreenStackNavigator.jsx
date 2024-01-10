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

const Stack = createStackNavigator();
const HomeScreenStackNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="MainWelcomeScreen">
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
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserProfileScreen"
          component={UserProfile}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeScreenStackNavigator;
