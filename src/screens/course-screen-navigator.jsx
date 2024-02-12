import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserCoursesPage from './user-courses-page';
import CourseLevelScreen from './course-level-screen';
import CourseDetailsScreen from './CourseDetailScreen';

const CourseScreenNavigator = () => {
  const Stack = createStackNavigator();
  return (
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
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailsScreen} />
    </Stack.Navigator>
  );
};

export default CourseScreenNavigator;
