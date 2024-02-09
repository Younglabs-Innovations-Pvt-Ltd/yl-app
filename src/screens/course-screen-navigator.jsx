import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import UserCoursesPage from './user-courses-page';
import CourseLevelScreen from './course-level-screen';
import CourseConductScreen from './course-conduct-screen';
import CourseDetailsScreen from './CourseDetailScreen';

const CourseScreenNavigator = () => {
  const Stack = createStackNavigator();
  return (
    // <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName={'userCourse'}>
      <Stack.Screen
        name="userCourse"
        component={UserCoursesPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CourseLevelPage"
        component={CourseLevelScreen}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
          name="CourseConductScreen"
          component={CourseConductScreen}
          options={{headerShown: false}}
        /> */}
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailsScreen} />
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default CourseScreenNavigator;
