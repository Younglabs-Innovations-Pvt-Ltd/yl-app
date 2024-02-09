import {View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import OrderRequestData from './orderDummyData.json';
import AppBar from '../components/UserCoursePageComponent/AppBar';
import CourseCard from '../components/UserCoursePageComponent/CourseCard';
import AddMoreCourse from '../components/UserCoursePageComponent/AddMoreCourse';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {handleCourseSelector} from '../store/handleCourse/selector';

const UserCoursesPage = ({navigation}) => {
  const {courses} = useSelector(welcomeScreenSelector);
  const [userCourseData, setUserCourseData] = useState(null);
  const [userName, setUserName] = useState(null);

  const {selectedUserOrder} = useSelector(welcomeScreenSelector);

  const {serviceReqClassesLoading} = useSelector(handleCourseSelector);

  useEffect(() => {
    console.log('serviceReqClassesLoading', serviceReqClassesLoading);
  }, [serviceReqClassesLoading]);

  useEffect(() => {
    if (selectedUserOrder) {
      const selectedUserKey = Object.keys(selectedUserOrder);
      if (selectedUserOrder[selectedUserKey]?.length > 0) {
        const newData = selectedUserOrder[selectedUserKey];
        console.log('of user', newData);
        setUserName(selectedUserKey);
        setUserCourseData(newData);
      }
    }
  }, [selectedUserOrder]);
  const {
    bgColor,
    bgSecondaryColor,
    textColors,
    colorYlMain,
    darkMode,
    addMoreCourseCardbgColor,
  } = useSelector(state => state.appTheme);

  return (
    <View
      style={{backgroundColor: bgColor}}
      className={`flex flex-col justify-start items-center relative h-[100%] w-[100%]`}>
      <AppBar
        userName={userName}
        textColors={textColors}
        bgColor={bgColor}
        darkMode={darkMode}
        bgSecondaryColor={bgSecondaryColor}
      />
      <View className="mt-2 flex flex-col justify-center items-center min-h-[20%] max-h-[48%] w-[100vw]">
        <ScrollView className="" showsVerticalScrollIndicator={false}>
          {userCourseData?.map(course => {
            return (
              <CourseCard
                
                course={course}
                navigation={navigation}
              />
            );
          })}
        </ScrollView>
      </View>
      <AddMoreCourse
        addMoreCourseCardbgColor={addMoreCourseCardbgColor}
        darkMode={darkMode}
        courses={courses}
        bgSecondaryColor={bgSecondaryColor}
        navigation={navigation}
      />
    </View>
  );
};

export default UserCoursesPage;
