import {View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import OrderRequestData from './orderDummyData.json';
import AppBar from '../components/UserCoursePageComponent/AppBar';
import CourseCard from '../components/UserCoursePageComponent/CourseCard';
import AddMoreCourse from '../components/UserCoursePageComponent/AddMoreCourse';

const UserCoursesPage = ({navigation}) => {
  const childrens = [
    {label: 'Himanshu', value: 'Himanshu'},
    {label: 'Kumar', value: 'Kumar'},
  ];
  const [userCourseData, setUserCourseData] = useState(null);

  const courses = [
    {
      imgUrl:
        'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
      courseName: 'Eng_Hw',
      startDate: '25 Dec 2023',
      courseType: 'Live',
      endDate: '25 Jan 24',
      sessions: 12,
    },
    {
      imgUrl:
        'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
      courseName: 'Eng_Hw',
      courseType: 'Recorded',
      sessions: 12,
    },
    {
      imgUrl:
        'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
      courseName: 'Eng_Hw',
      startDate: '25 Dec 2023',
      courseType: 'Live',
      endDate: '25 Jan 24',
      sessions: 12,
    },
  ];
  useEffect(() => {
    if (OrderRequestData?.orderData?.length > 0) {
      const newData = OrderRequestData?.orderData;
      setUserCourseData(OrderRequestData?.orderData);
    }
  }, [OrderRequestData]);
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
        childrens={childrens}
        textColors={textColors}
        bgColor={bgColor}
        darkMode={darkMode}
        bgSecondaryColor={bgSecondaryColor}
      />
      <View className="mt-2 flex flex-col justify-center items-center w-[100vw]">
        <ScrollView className="h-[48%]" showsVerticalScrollIndicator={false}>
          {userCourseData?.map(course => {
            console.log('user data check', course?.orderId);
            return (
              <CourseCard
                key={course?.orderId}
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
        bgSecondaryColor={bgSecondaryColor}
      />
    </View>
  );
};

export default UserCoursesPage;
