import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserCoursesPage from './user-courses-page';
import CourseLevelScreen from './course-level-screen';
import CourseDetailsScreen from './CourseDetailScreen';
import {useSelector} from 'react-redux';

const CourseScreenNavigator = () => {
  const {textColors} = useSelector(state => state.appTheme);
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName={'userCourse'}
      screenOptions={{
        headerStyle: {
          backgroundColor: textColors.textYlMain,
          elevation: 1.12,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: '500',
          fontSize: 18,
        },
      }}>
      <Stack.Screen
        name="userCourse"
        component={UserCoursesPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CourseLevelPage"
        component={CourseLevelScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailsScreen} />
    </Stack.Navigator>
  );
};

export default CourseScreenNavigator;
