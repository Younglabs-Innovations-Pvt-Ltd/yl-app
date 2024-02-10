import {View, ScrollView, Dimensions, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AppBar from '../components/UserCoursePageComponent/AppBar';
import CourseCard from '../components/UserCoursePageComponent/CourseCard';
import AddMoreCourse from '../components/UserCoursePageComponent/AddMoreCourse';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {handleCourseSelector} from '../store/handleCourse/selector';
import {userSelector} from '../store/user/selector';
import {Text} from 'react-native-animatable';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {ChangeAddedChild} from '../components/HeaderComponent';
import PopularCourses from '../components/UserCoursePageComponent/PopularCourses';
import auth from '@react-native-firebase/auth';

// Shimmer effect
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {authSelector} from '../store/auth/selector';
import {startFetchingUserOrders} from '../store/welcome-screen/reducer';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const {width, height} = Dimensions.get('window');
const UserCoursesPage = ({navigation}) => {
  const dispatch = useDispatch();
  const {courses, userOrdersLoading, userOrderLoadingFailed, userOrders} =
    useSelector(welcomeScreenSelector);
  const [userCourseData, setUserCourseData] = useState(null);
  const [userName, setUserName] = useState(null);
  const {serviceReqClassesLoading} = useSelector(handleCourseSelector);
  const {currentChild} = useSelector(userSelector);
  const [changeChildSheet, setChangeChildSheeet] = useState(false);
  const [coursesSheetOpen, setCoursesSheetOpen] = useState(false);
  const {user, customer} = useSelector(authSelector);

  useEffect(() => {
    console.log('serviceReqClassesLoading', serviceReqClassesLoading);
  }, [serviceReqClassesLoading]);

  useEffect(() => {
    if (userOrders?.length > 0 && currentChild) {
      const filteredOrders = userOrders?.filter(
        item => item.childName === currentChild?.name,
      );
      setUserCourseData(filteredOrders);
      setUserName(currentChild.name);
    }
  }, [currentChild, userOrders]);
  const {
    bgColor,
    bgSecondaryColor,
    textColors,
    colorYlMain,
    darkMode,
    addMoreCourseCardbgColor,
  } = useSelector(state => state.appTheme);

  const onChangeChildSheetClose = () => {
    setChangeChildSheeet(false);
  };

  const getOrders = async () => {
    console.log('in func');

    const token = await auth().currentUser?.getIdToken();
    let body = {
      leadId: user?.leadId,
      token,
    };
    console.log('dispatcing');

    dispatch(startFetchingUserOrders(body));
  };

  const getUserOrders = () => {
    if (customer == 'yes') {
      console.log('getting Orders');
      getOrders();
    }
  };

  return (
    <View className="flex-1" style={{backgroundColor: bgColor}}>
      {userOrdersLoading ? (
        <CourseLoadingSkeleton />
      ) : userOrderLoadingFailed ? (
        <View className="w-full items-center mt-6">
          <Text
            className="text-xl font-semibold"
            style={{color: textColors.textSecondary}}>
            Failed To Fetch Courses
          </Text>
          <View>
            <Pressable
              className=" rounded py-2 px-5 mt-4"
              style={{backgroundColor: textColors.textYlMain}}
              onPress={getUserOrders}>
              <Text className="text-[15px] font-semibold text-white">
                Try Again
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View
          style={{backgroundColor: bgColor}}
          className={`flex flex-col justify-start items-center h-[100%] w-[100%]`}>
          <AppBar
            userName={userName}
            textColors={textColors}
            bgColor={bgColor}
            darkMode={darkMode}
            bgSecondaryColor={bgSecondaryColor}
            changeChildsheetOpen={() => setChangeChildSheeet(true)}
          />
          {userCourseData?.length > 0 ? (
            <View className="mt-2 flex flex-col justify-center items-center h-[70%] w-[100vw]">
              <ScrollView className="" showsVerticalScrollIndicator={false}>
                {userCourseData?.map(course => {
                  return <CourseCard course={course} navigation={navigation} />;
                })}
              </ScrollView>
            </View>
          ) : (
            <View className="mt-2 flex flex-col justify-center items-center h-[70%] w-[100vw]">
              <Text className="text-2xl font-semibold text-gray-400 px-3 text-center mt-4">
                {userName} Doesn't Have Any Course
              </Text>
            </View>
          )}

          <View className="h-[25%] w-full items-center flex-1">
            <AddMoreCourse
              addMoreCourseCardbgColor={addMoreCourseCardbgColor}
              darkMode={darkMode}
              courses={courses}
              bgSecondaryColor={bgSecondaryColor}
              navigation={navigation}
              openCoursesSheet={() => {
                setCoursesSheetOpen(true);
              }}
              textColors={textColors}
            />
          </View>

          <BottomSheetComponent
            isOpen={changeChildSheet}
            onClose={() => onChangeChildSheetClose()}
            Children={<ChangeAddedChild close={onChangeChildSheetClose} />}
            snapPoint={['25%', '55%']}
          />

          <BottomSheetComponent
            isOpen={coursesSheetOpen}
            Children={
              <PopularCourses courses={courses} navigation={navigation} />
            }
            onClose={() => setCoursesSheetOpen(false)}
            snapPoint={['50%', '75%']}
          />
        </View>
      )}
    </View>
  );
};

const CourseLoadingSkeleton = () => {
  return (
    <View className="flex-1 w-full">
      <View className="mt-1">
        <ShimmerPlaceholder
          shimmerWidthPercent={0.7}
          // shimmerColors={["#a49f9f8c","#322f3a9c","#000000b8"]}
          style={{
            width: width,
            height: 80,
          }}
          className="rounded-b"></ShimmerPlaceholder>
      </View>

      <View className="items-center w-full mt-4">
        {[1, 2].map(item => {
          return (
            <View key={item}>
              <ShimmerPlaceholder
                shimmerWidthPercent={0.7}
                style={{width: width - 20}}
                className="rounded w-[95%] h-[150px] mt-5"></ShimmerPlaceholder>
            </View>
          );
        })}
      </View>
    </View>
  );
};
export default UserCoursesPage;
