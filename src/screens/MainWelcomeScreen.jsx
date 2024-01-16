import {View, Text, Dimensions, ImageBackground, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Spacer from '../components/spacer.component';
import MainSwiper from '../components/MainScreenComponents/MainSwiper';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {COLORS} from '../utils/constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkMode} from '../store/app-theme/appThemeReducer';
import Animated, {
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import HeaderComponent from '../components/HeaderComponent';
import {
  setDemoData,
  startFetchBookingDetailsFromPhone,
} from '../store/join-demo/join-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import DemoDetailsScreen from '../components/MainScreenComponents/DemoDetailsScreen';
import Demo from '../components/demo.component';
import TapeTimer from '../components/TapeTimer';
import PostDemoAction from '../components/join-demo-class-screen/post-demo-actions.component';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {AddChildModule} from '../components/MainScreenComponents/AddChildModule';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {getCoursesForWelcomeScreen} from '../store/welcome-screen/reducer';
import {Button} from 'react-native-share';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import RecordingCourseBanner from '../components/MainScreenComponents/RecordingCourseBanner';
import SwiperSlide from '../components/MainScreenComponents/SwiperSlide';
import {authSelector} from '../store/auth/selector';

const {width, height} = Dimensions.get('window');

const handwritingCourses = [
  {
    name: 'English Cursive',
    courseId: 'Eng_Hw',
    icon: 'alpha-e',
    showBookDemoScreen: true,
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
    thumbnailUrl:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
  },
  {
    name: 'English Print',
    icon: 'pinterest',
    courseId: 'English_PrintHW',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
    thumbnailUrl:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/courses%2FEnglish_PrintHW%2FthimbnailUrl.webp?alt=media&token=b81a6eb1-e4bf-4e0c-af96-4659c0106422',
  },
  {
    name: 'Hindi Handwriting',
    icon: 'abugida-devanagari',
    courseId: 'Maths_Learning',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
    thumbnailUrl:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/course%20cover%20pictures%2Freading.webp?alt=media&token=34617f04-1c15-4bff-a75e-8a6668ad373a',
  },
  {
    name: 'English Cursive2',
    icon: 'abjad-arabic',
    courseId: 'Science_Learning',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
    thumbnailUrl:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/courses%2Ftuition_homework%2FthimbnailUrl.png?alt=media&token=19d07140-4a86-4671-88c2-c50003868795',
  },
];

const courseListHeadingStyle = 'text-[23px] capitalize font-bold';

const swiperData = [
  {
    name: 'Banner 1',
    coverImage:
      'https://img.freepik.com/free-photo/playful-boy-holding-stack-books_23-2148414547.jpg?w=740&t=st=1703674788~exp=1703675388~hmac=24445b95541fba0512cfcb562557440de28ed52ef02e516f9a050a1d2871cc21',
    type: 'course',
    screenRedirectButton: '',
    age_max: 14,
    age_min: 5,
    alternativeNameOnApp: 'English Handwriting',
    courseAvailable: true,
    courseAvailableType: 'both',
    coverPicture:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
    demoAvailable: true,
    demoAvailableType: 'both',
    duration_minutes: 60,
    id: 'Eng_Hw',
    live_classes: 24,
    subheading:
      'Handwriting improvement tutoring and fine motor skills practice for children who face problems with handwriting.',
    title: 'English Cursive Handwriting Course',
  },
];

const phoneNum = 7668983758;

const MainWelcomeScreen = ({navigation}) => {
  const {customer} = useSelector(authSelector);
  const [showPostActions, setShowPostActions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showAddChildView, setShowAddChildView] = useState(false);
  const [refreshCourses, setRefreshCourses] = useState({});
  const {darkMode, bgColor, textColors, colorYlMain, bgSecondaryColor} =
    useSelector(state => state.appTheme);
  const dispatch = useDispatch();
  const {
    demoData,
    loading,
    demoPhoneNumber,
    bookingDetails,
    demoBookingId,
    teamUrl,
    isAttended,
    isAttendenceMarked,
    bookingTime,
  } = useSelector(joinDemoSelector);

  const {ipData} = useSelector(bookDemoSelector);

  const {courses, coursesLoading, coursesLoadingFailed} = useSelector(
    welcomeScreenSelector,
  );

  // console.log('course are ', courses[0]);

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  useEffect(() => {
    dispatch(
      getCoursesForWelcomeScreen({country: ipData?.country_name || 'behrin'}),
    );
  }, [refreshCourses, ipData]);

  useEffect(() => {
    console.log('Getting booking Details');
    if (!bookingDetails && phoneNum) {
      dispatch(startFetchBookingDetailsFromPhone(phoneNum));
    }
  }, [phoneNum, bookingDetails]);

  // Demo actions useEffects here

  const getTimeRemaining = bookingDate => {
    const countDownTime = new Date(bookingDate).getTime();
    const now = Date.now();

    const remainingTime = countDownTime - now;

    const days = Math.floor((remainingTime / (1000 * 60 * 60 * 24)) % 24);
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    if (remainingTime <= 0) {
      return {days: 0, hours: 0, minutes: 0, seconds: 0, remainingTime};
    }

    return {days, hours, minutes, seconds, remainingTime};
  };

  useEffect(() => {
    if (demoData) {
      dispatch(setDemoData({demoData, phoneNum}));
    }
  }, [demoData]);

  useEffect(() => {
    if (!bookingTime) return;

    const isDemoOver =
      new Date(bookingTime).getTime() + 1000 * 60 * 50 <= Date.now();

    console.log('isDemoOver', isDemoOver);

    if (isDemoOver && isAttended && teamUrl) {
      setShowPostActions(true);
    } else {
      setShowPostActions(false);
    }
  }, [bookingTime, isAttended, teamUrl]);

  useEffect(() => {
    let timer;
    if (bookingTime) {
      timer = setInterval(() => {
        const remaining = getTimeRemaining(bookingTime);
        if (remaining.remainingTime <= 0) {
          setIsTimeover(true);
          clearInterval(timer);
          return;
        }

        // if (new Date(bookingTime).getTime() - 1000 <= new Date().getTime()) {
        //   dispatch(startFetchBookingDetailsFromPhone(demoPhoneNumber));
        // }

        // set time to show
        setTimeLeft(remaining);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [bookingTime, demoPhoneNumber, dispatch]);

  return (
    <View style={[tw`items-center flex-1 `, {backgroundColor: bgColor}]}>
      <HeaderComponent
        navigation={navigation}
        setShowAddChildView={setShowAddChildView}
      />

      <ScrollView
        className="px-2 py-1"
        style={{
          flex: 1,
          width: width,
        }}
        contentContainerStyle={{alignItems: 'center'}}>
        {!showPostActions && (timeLeft || isTimeover) && (
          <View
            className="rounded-md w-full my-1"
            style={{backgroundColor: colorYlMain}}>
            <Demo
              timeLeft={timeLeft}
              isTimeover={isTimeover}
              showPostActions={showPostActions}
            />
          </View>
        )}

        {/* <TapeTimer timeLeft={timeLeft} isTimeover={isTimeover} /> */}

        <SwiperFlatList
          autoplay
          autoplayDelay={9}
          autoplayLoopKeepAnimation={true}
          autoplayLoop
          index={0}
          showPagination={swiperData.length > 1}
          className="relative"
          paginationStyle={[tw`absolute`, {top: height - height / 3 - 40}]}
          paginationStyleItem={tw`h-[4px] bg-gray-500`}
          paginationActiveColor={'#000'}
          paginationStyleItemActive={{backgroundColor: textColors.textYlMain}}
          paginationStyleItemInactive={{backgroundColor: 'gray'}}
          data={swiperData}
          style={[
            {
              width: width,
              position: 'relative',
              height: height - height / 3 - 40,
            },
          ]}
          contentContainerStyle={{overflow: 'hidden'}}
          renderItem={item => (
            <SwiperSlide item={item.item} navigation={navigation} />
          )}
        />

        {/* Post demo Actions here */}
        {showPostActions && (
          <View
            className="w-full p-2 rounded-md mt-3"
            style={{
              backgroundColor: darkMode ? bgSecondaryColor : colorYlMain,
            }}>
            <PostDemoAction rescheduleClass={'onOpen'} />
          </View>
        )}

        {/* Handwriting courses here */}
        <Spacer space={5} />
        <View style={tw`py-1 w-[100%]`}>
          <View style={tw`gap-1 pl-2 pr-3 flex-row items-center`}>
            <Text
              className={`w-[80%] ${courseListHeadingStyle}`}
              style={{color: textColors?.textPrimary}}>
              Handwriting Improvement
            </Text>

            <Pressable
              className="flex-row items-center"
              onPress={() => {
                navigation.navigate('AllCoursesScreen', {
                  courses: handwritingCourses,
                  heading: 'Handwriting Improvement',
                });
              }}>
              <Text className="font-semibold" style={{color: COLORS.pblue}}>
                See all
              </Text>
              <MIcon name="chevron-right" size={22} color={COLORS.pblue} />
            </Pressable>
          </View>

          <FlatList
            data={courses}
            keyExtractor={item => item.name}
            renderItem={item => {
              return (
                <CourseItemRender
                  data={item.item}
                  navigation={navigation}
                  phone={phoneNum}
                />
              );
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={tw`pt-1`}
          />
        </View>

        {/* English Learning courses here */}
        {/* <Spacer space={0} />
        <View style={tw`gap-[0px]  w-full py-1`}>
          <View style={tw`gap-1 pl-2 pr-3 flex-row items-center`}>
            <Text
              className={`w-[80%] ${courseListHeadingStyle}`}
              style={{color: textColors?.textPrimary}}>
              English Learning
            </Text>

            <Pressable
              className="flex-row items-center"
              onPress={() => {
                navigation.navigate('AllCoursesScreen', {
                  courses: englishLearningCourses,
                });
              }}>
              <Text className="font-semibold" style={{color: COLORS.pblue}}>
                See all
              </Text>
              <MIcon name="chevron-right" size={22} color={COLORS.pblue} />
            </Pressable>
          </View>

          <FlatList
            data={englishLearningCourses}
            keyExtractor={item => item.name}
            renderItem={item => {
              return (
                <CourseItemRender data={item.item} navigation={navigation} />
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`pt-1 `}
            className="h-[auto]"
          />
        </View> */}

        <Spacer space={8} />
        <View
          style={[
            tw`w-[100%] flex-row gap-2 items-center rounded-lg justify-center items-center`,
          ]}>
          <RecordingCourseBanner navigation={navigation} />
        </View>

        <Spacer space={16} />
      </ScrollView>

      <BottomSheetComponent
        isOpen={showAddChildView}
        onClose={() => setShowAddChildView(false)}
        Children={AddChildModule}
        snapPoint={customer == 'yes' ? ['25%', '50%'] : ['50%', '90%']}
      />
    </View>
  );
};

export default MainWelcomeScreen;

const CourseItemRender = ({data, navigation}) => {
  const {darkMode, bgColor, textColors} = useSelector(state => state.appTheme);
  return (
    <>
      <Pressable
        onPress={() => {
          navigation.navigate('CourseDetailScreen', {
            courseData: data,
          });
        }}>
        <View
          style={tw`overflow-hidden items-center h-[160px] mx-[3px] shadow rounded-md bg-gray-100  w-[110px]`}>
          <ImageBackground
            source={{
              uri:
                data.coverPicture ||
                'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/courses%2FEng_Tuitions_5-14%2FthimbnailUrl.jpeg?alt=media&token=be2b7b32-311d-4951-8e47-61ab5fbfc529',
            }}
            style={[
              tw`w-[100%] rounded h-full justify-center items-center`,
              {flex: 1, resizeMode: 'cover'},
            ]}>
            <LinearGradient
              colors={['#00000014', '#000000db']}
              className="w-full"
              start={{x: 0.5, y: 0.5}}
              // end={{x: 0.8, y: 1}}
            >
              <View style={tw`h-[20%] justify-center items-center`}></View>
              <View style={tw`h-[80%] items-start justify-end p-1 `}>
                {data?.alternativeNameOnApp?.split(' ').map((item, index) => {
                  return (
                    <Text
                      key={index}
                      style={[tw`font-semibold`, {lineHeight: 20}]}
                      className="flex-wrap text-white text-[18px]">
                      {item}
                    </Text>
                  );
                })}
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </Pressable>
    </>
  );
};
