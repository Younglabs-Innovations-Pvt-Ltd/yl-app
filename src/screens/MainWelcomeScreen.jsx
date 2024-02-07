import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
  ActivityIndicator,
} from 'react-native';
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
import HeaderComponent, {ChangeAddedChild} from '../components/HeaderComponent';
import {
  setDemoData,
  startFetchBookingDetailsFromPhone,
  startFetchBookingDetailsFromId,
  setToInitialState,
} from '../store/join-demo/join-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import DemoDetailsScreen from '../components/MainScreenComponents/DemoDetailsScreen';
import Demo from '../components/demo.component';
import TapeTimer from '../components/TapeTimer';
import PostDemoAction from '../components/join-demo-class-screen/post-demo-actions.component';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {AddChildModule} from '../components/MainScreenComponents/AddChildModule';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {
  getCoursesForWelcomeScreen,
  setSelectedChild,
} from '../store/welcome-screen/reducer';
import {Button} from 'react-native-share';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import RecordingCourseBanner from '../components/MainScreenComponents/RecordingCourseBanner';
import SwiperSlide from '../components/MainScreenComponents/SwiperSlide';
import {authSelector} from '../store/auth/selector';
import Testimonial from '../components/MainScreenComponents/Testimonial';
import {FONTS} from '../utils/constants/fonts';
import BookDemoScreen from './book-demo-form.screen';
import ShowCourses from '../components/MainScreenComponents/ShowCourses';
import ReviewsAndTestimonials from '../components/MainScreenComponents/ReviewsAndTestimonials';
import {fetchUser, setIsCustomer} from '../store/auth/reducer';
import {localStorage} from '../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../utils/storage/local-storage-keys';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';

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

const sectionHeadingStyle = '';

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

const testimonials = [
  {
    name: 'Jhon Doe',
    posted_on: '12-04-2022',
    comment:
      'lorem ipsum d Pellentesque habitant morbi tristique senectus et netus et malesu faucibus et faucibus et feugiat labor lorem. Lorem ipsum dolor sit am',
    coverPictureLink: null,
  },
  {
    name: 'Harry hess',
    posted_on: '16-03-2023',
    comment:
      'lorementesque habi tant morbi tristique senectus et netus et malesu faucibus et faucibus et feugiat labor lorem. Lorem ipsum dolor sit am lorem ipsum adhf hadfiuh ',
    coverPictureLink: null,
  },
  {
    name: 'Simon dull',
    posted_on: '16-03-2023',
    comment:
      'lorementesque habi tant morbi tristique senectus et netus et malesu faucibus et faucibus et feugiat labor lorem. Lorem ipsum dolor sit am lorem ipsum adhf hadfiuh ',
    coverPictureLink: null,
  },
];

const MainWelcomeScreen = ({navigation}) => {
  const toast = useToast();
  const {customer} = useSelector(authSelector);
  const [showPostActions, setShowPostActions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showAddChildView, setShowAddChildView] = useState(false);
  const [showChangeChildView, setShowChangeChildView] = useState(false);
  const [showBookFreeClassSheet, setShowBookFreeClassSheet] = useState(false);
  const [showRescheduleClassSheet, setShowRescheduleClassSheet] =
    useState(false);

  const {darkMode, bgColor, textColors, colorYlMain, bgSecondaryColor} =
    useSelector(state => state.appTheme);

  const {user} = useSelector(authSelector);
  // console.log("user phone nym", user?.phone)
  const {selectedChild} = useSelector(welcomeScreenSelector);

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

  useEffect(() => {
    let loginDetails = localStorage.getString('loginDetails');
    console.log("login details in top", loginDetails)
    if (!user && loginDetails) {
    console.log('fetching user...');
    loginDetails = JSON.parse(loginDetails);
    console.log('got login details: ' + loginDetails.loginType);

    if (!loginDetails) {
      Showtoast({
        text: 'Failed To Load Data, please logout and login again',
        toast,
        type: 'danger',
      });
    }

    console.log('login details is', loginDetails);
    if (loginDetails.loginType === 'whatsAppNumber') {
      console.log('getting user by', loginDetails.phone);
      dispatch(fetchUser({phone: loginDetails.phone}));
    } else if (loginDetails.loginType === 'customerLogin') {
      console.log('getting user by', loginDetails.email);
      dispatch(fetchUser({email: loginDetails.email}));
      dispatch(setIsCustomer(true));
    }
    }
  }, [user]);

  useEffect(() => {
    // console.log("running for selectedChild", selectedChild.bookingId)
    if (selectedChild?.bookingId) {
      dispatch(setToInitialState());
      dispatch(startFetchBookingDetailsFromId(selectedChild.bookingId));
    } else if (user?.phone) {
      dispatch(startFetchBookingDetailsFromPhone(user.phone));
    }
  }, [user, selectedChild]);

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
    if (demoData && user?.phone) {
      dispatch(setDemoData({demoData, phone: user?.phone}));
    }
  }, [demoData, user]);

  useEffect(() => {
    if (!bookingTime) return;
    const isDemoOver =
      new Date(bookingTime).getTime() + 1000 * 60 * 50 <= Date.now();

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

  // Change Added Child actions
  const onChangeChildSheetOpen = () => {
    console.log('opening'), setShowChangeChildView(true);
  };
  const onChangeChildSheetClose = () => {
    setShowChangeChildView(false);
  };

  // ---------

  return (
    <View style={[tw`items-center flex-1 `, {backgroundColor: bgColor}]}>
      <HeaderComponent
        navigation={navigation}
        setShowAddChildView={setShowAddChildView}
        open={onChangeChildSheetOpen}
      />

      {/* {console.log("showPostactions is", showPostActions)} */}
      {!loading && (
        <View className="w-full" style={{backgroundColor: colorYlMain}}>
          <Demo
            timeLeft={timeLeft}
            isTimeover={isTimeover}
            showPostActions={showPostActions}
            sheetOpen={() => setShowBookFreeClassSheet(true)}
            openResheduleSheet={() => setShowRescheduleClassSheet(true)}
            closeResheduleSheet={() => setShowRescheduleClassSheet(false)}
          />
        </View>
      )}

      <ScrollView
        className="px-2 py-1"
        style={{
          flex: 1,
          width: width,
        }}
        contentContainerStyle={{alignItems: 'center'}}>
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

        <Spacer space={8} />

        <ShowCourses navigation={navigation} />

        {/* Reviews And Testimonials Here */}
        <Spacer space={12} />
        <ReviewsAndTestimonials />

        {/* Testimonials */}
        <Spacer space={12} />
        <View className="w-full">
          <View>
            <Text
              className={`${sectionHeadingStyle}`}
              style={[FONTS.heading, {color: textColors.textPrimary}]}>
              What Our Customer Speak
            </Text>
          </View>
          <View className="w-[100%] mt-1">
            <FlatList
              data={testimonials}
              keyExtractor={item => item.name}
              renderItem={item => {
                return <Testimonial data={item.item} />;
              }}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={()=>{
                return<View className="p-1"></View>
              }}
              horizontal
            />
          </View>
        </View>

        <Spacer space={16} />
      </ScrollView>

      <BottomSheetComponent
        isOpen={showAddChildView}
        onClose={() => setShowAddChildView(false)}
        Children={AddChildModule}
        snapPoint={customer == 'yes' ? ['25%', '50%'] : ['50%', '90%']}
      />

      {/* Change Child Sheet */}

      <BottomSheetComponent
        isOpen={showChangeChildView}
        onClose={() => onChangeChildSheetClose()}
        Children={<ChangeAddedChild close={onChangeChildSheetClose} />}
        snapPoint={['25%', '55%']}
      />

      {/* book free class sheet */}
      <BottomSheetComponent
        isOpen={showBookFreeClassSheet}
        onClose={() => setShowBookFreeClassSheet(false)}
        Children={
          <BookDemoScreen
            navigation={''}
            data={{country: {callingCode: 91}, phone: 7668983758}}
            courseId={'Eng_Hw'}
            demoAvailableType={'both'}
            place={'bookFreeClass'}
          />
        }
        snapPoint={['50%', '90%']}
      />

      {/* Reschedule class sheet */}
      <BottomSheetComponent
        isOpen={showRescheduleClassSheet}
        onClose={() => setShowRescheduleClassSheet(false)}
        Children={
          <BookDemoScreen
            navigation={''}
            data={{country: {callingCode: 91}, phone: 7668983758}}
            courseId={'Eng_Hw'}
            setSelectedTab={''}
            demoAvailableType={'both'}
            place={'rescheduleClass'}
          />
        }
        snapPoint={['50%', '90%']}
      />
    </View>
  );
};

export default MainWelcomeScreen;

// Extra code and recorded course code

{
  /* English Learning courses here */
}
{
  /* <Spacer space={0} />

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
        </View> */
}

{
  /* <Spacer space={8} />
        <View
          style={[
            tw`w-[100%] flex-row gap-2 items-center rounded-lg justify-center items-center`,
          ]}>
          <RecordingCourseBanner navigation={navigation} />
        </View> */
}
