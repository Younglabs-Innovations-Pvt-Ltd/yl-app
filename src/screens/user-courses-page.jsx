import {View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AppBar from '../components/UserCoursePageComponent/AppBar';
import CourseCard from '../components/UserCoursePageComponent/CourseCard';
import AddMoreCourse from '../components/UserCoursePageComponent/AddMoreCourse';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {handleCourseSelector} from '../store/handleCourse/selector';
import {userSelector} from '../store/user/selector';
import {Text} from 'react-native-animatable';

const UserCoursesPage = ({navigation}) => {
  const {courses} = useSelector(welcomeScreenSelector);
  const [userCourseData, setUserCourseData] = useState(null);
  const [userName, setUserName] = useState(null);
  const {selectedUserOrder, userOrders} = useSelector(welcomeScreenSelector);
  const {serviceReqClassesLoading} = useSelector(handleCourseSelector);
  const {currentChild} = useSelector(userSelector);

  useEffect(() => {
    console.log('serviceReqClassesLoading', serviceReqClassesLoading);
  }, [serviceReqClassesLoading]);

  useEffect(() => {
    if (userOrders?.length > 0 && currentChild) {
      const filteredOrders = userOrders?.filter(
        item => item.childName === currentChild?.name,
      );
      console.log('filtered orders are:', filteredOrders);
      setUserCourseData(filteredOrders);
      setUserName(currentChild.name);
    }
  }, [selectedUserOrder, currentChild]);
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
      {userCourseData?.length > 0 ? (
        <View className="mt-2 flex flex-col justify-center items-center min-h-[20%] max-h-[60%] w-[100vw]">
          <ScrollView className="" showsVerticalScrollIndicator={false}>
            {userCourseData?.map(course => {
              return <CourseCard course={course} navigation={navigation} />;
            })}
          </ScrollView>
        </View>
      ) : (
        <View className="mt-2 flex flex-col justify-center items-center min-h-[20%] max-h-[60%] w-[100vw]">
          <Text className="text-2xl font-semibold text-gray-400 px-3 text-center mt-4">
            {userName} Doesn't Have Any Course
          </Text>
        </View>
      )}

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
