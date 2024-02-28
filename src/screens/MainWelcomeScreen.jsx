import {View, Dimensions, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import Spacer from '../components/spacer.component';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {useDispatch, useSelector} from 'react-redux';
import HeaderComponent, {ChangeAddedChild} from '../components/HeaderComponent';
import {
  setDemoData,
  startFetchBookingDetailsFromPhone,
  startFetchBookingDetailsFromId,
  setToInitialState,
} from '../store/join-demo/join-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import Demo from '../components/demo.component';
import BottomSheetComponent from '../components/BottomSheetComponent';
import {AddChildModule} from '../components/MainScreenComponents/AddChildModule';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import SwiperSlide from '../components/MainScreenComponents/SwiperSlide';
import {authSelector} from '../store/auth/selector';
import BookDemoScreen from './book-demo-form.screen';
import ShowCourses from '../components/MainScreenComponents/ShowCourses';
import ReviewsAndTestimonials from '../components/MainScreenComponents/ReviewsAndTestimonials';
import {fetchUserFormLoginDetails} from '../store/auth/reducer';
import {localStorage} from '../utils/storage/storage-provider';
import {startFetchingUserOrders} from '../store/welcome-screen/reducer';
import auth from '@react-native-firebase/auth';
import {setIsFirstTimeUser} from '../store/user/reducer';
import {userSelector} from '../store/user/selector';
import {setDarkMode} from '../store/app-theme/appThemeReducer';

// Shimmer effects
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {redirectToCourse} from '../utils/redirectToCourse';
import ModalComponent from '../components/modal.component';
import {COLORS} from '../utils/constants/colors';
import TextWrapper from '../components/text-wrapper.component';
import {FONTS} from '../utils/constants/fonts';
import {networkSelector} from '../store/network/selector';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const {width, height} = Dimensions.get('window');

const MainWelcomeScreen = ({navigation}) => {
  const [showPostActions, setShowPostActions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showAddChildView, setShowAddChildView] = useState(false);
  const [showChangeChildView, setShowChangeChildView] = useState(false);
  const [showBookFreeClassSheet, setShowBookFreeClassSheet] = useState(false);
  const [showRescheduleClassSheet, setShowRescheduleClassSheet] =
    useState(false);
  const dispatch = useDispatch();
  const [swiperData, setSwiperData] = useState([]);

  const {customer, user, userFetchLoading} = useSelector(authSelector);
  const {bgColor, textColors, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  const {currentChild} = useSelector(userSelector);
  const {courses, coursesLoading} = useSelector(welcomeScreenSelector);

  const [refresh, setRefresh] = useState(false);

  const {
    demoData,
    loading,
    demoPhoneNumber,
    bookingDetails,
    teamUrl,
    isAttended,
    bookingTime,
    isNmi,
    appRemark,
  } = useSelector(joinDemoSelector);

  const {ipData, loading: loadings} = useSelector(bookDemoSelector);
  const {
    networkState: {isConnected},
  } = useSelector(networkSelector);

  // fetch IpData
  useEffect(() => {
    if (isConnected && !ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData, isConnected]);

  // filter courses to show on the banner
  useEffect(() => {
    if (courses) {
      let arr = [];
      const course = courses || {};
      Object.keys(course).map(key => {
        arr.push(...course[key]);
      });
      const filteredCourse = arr.filter(course => course.id === 'Eng_Hw');
      setSwiperData(filteredCourse);
    }
  }, [courses]);

  // setting apptheme
  useEffect(() => {
    const payload = localStorage.getBoolean('darkModeEnabled');
    console.log('setting darkmode', payload);

    dispatch(setDarkMode(payload));
  }, []);

  // Fetching user details here
  useEffect(() => {
    let loginDetails = localStorage.getString('loginDetails');
    if (!user && loginDetails) {
      dispatch(fetchUserFormLoginDetails());
    }
  }, [user]);

  // fetching user orders here
  useEffect(() => {
    if (!user) {
      return;
    }
    const getOrders = async () => {
      console.log('gettting orders');
      const token = await auth().currentUser?.getIdToken();
      let body = {
        leadId: user?.leadId,
        token,
      };
      dispatch(startFetchingUserOrders(body));
    };
    if (customer == 'yes') {
      getOrders();
    }
  }, [customer, user]);

  // Fetching booking Details of user
  useEffect(() => {
    if (customer !== 'yes') {
      if (currentChild) {
        console.log(
          'getting booking for ',
          currentChild?.name,
          currentChild.bookingId,
        );
        if (currentChild?.bookingId) {
          setIsFirstTimeUser(false);
          dispatch(setToInitialState());
          dispatch(startFetchBookingDetailsFromId(currentChild?.bookingId));
        } else {
          dispatch(setIsFirstTimeUser(true));
        }
      } else if (user?.phone) {
        dispatch(
          startFetchBookingDetailsFromPhone({
            phone: user?.phone,
            callingCode: ipData?.calling_code,
          }),
        );
      }
    } else if (user?.phone && customer == 'yes') {
      console.log('is customer yes and getting details from phone');
      console.log('user.phone', user.phone);
      dispatch(
        startFetchBookingDetailsFromPhone({
          phone: user?.phone,
          callingCode: ipData?.calling_code,
        }),
      );
    }
  }, [user, currentChild, ipData]);

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
    console.log('demo data here is');
    if (demoData && user?.phone && bookingDetails) {
      console.log('dispatching function');
      dispatch(setDemoData({demoData, phone: user?.phone, bookingDetails}));
    }
  }, [demoData, user, isTimeover, bookingDetails]);

  useEffect(() => {
    if (!bookingTime) return;
    const isDemoOver =
      new Date(bookingTime).getTime() + 1000 * 60 * 50 <= Date.now();

    if (isDemoOver && isAttended && teamUrl && !isNmi && !appRemark) {
      setShowPostActions(true);
    } else {
      setShowPostActions(false);
    }
  }, [bookingTime, isAttended, teamUrl, isNmi, appRemark]);

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
    setShowChangeChildView(true);
  };
  const onChangeChildSheetClose = () => {
    setShowChangeChildView(false);
  };

  // ---------Referesh
  // const pullMe = () => {
  //   setRefresh(true);
  //   console.log('dispating refresh');
  //   dispatch(fetchUserFormLoginDetails());
  //   dispatch(
  //     getCoursesForWelcomeScreen({country: ipData?.country_name || 'none'}),
  //   );
  //   dispatch;
  //   setTimeout(() => {
  //     setRefresh(false);
  //   }, 3000);
  // };

  const rescheduleClass = () => {
    if (bookingDetails) {
      const courseId = bookingDetails.courseId;
      const subScreen = 'bookFreeClass';
      redirectToCourse({
        navigate: navigation.navigate,
        courseId,
        courses,
        subScreen,
      });
    }
  };

  return (
    <View style={[tw`items-center flex-1 `, {backgroundColor: bgColor}]}>
      <HeaderComponent
        navigation={navigation}
        setShowAddChildView={setShowAddChildView}
        open={onChangeChildSheetOpen}
        ipData={ipData}
      />
      {loading ? (
        <View>
          <ShimmerPlaceholder
            // shimmerWidthPercent={}
            style={{
              width: width,
              height: 80,
              borderRadius: 8,
            }}></ShimmerPlaceholder>
        </View>
      ) : (
        <View className="w-full" style={{backgroundColor: colorYlMain}}>
          <Demo
            timeLeft={timeLeft}
            isTimeover={isTimeover}
            showPostActions={showPostActions}
            sheetOpen={() => setShowBookFreeClassSheet(true)}
            rescheduleClass={rescheduleClass}
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
        contentContainerStyle={{alignItems: 'center'}}
        // refreshControl={
        //   <RefreshControl refreshing={refresh} onRefresh={() => pullMe()} />
        // }
      >
        {userFetchLoading && (
          <ModalComponent visible={!userFetchLoading}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}>
              <View style={{justifyContent: 'center'}}>
                <ActivityIndicator size={'large'} color={COLORS.white} />
                <TextWrapper ff={FONTS.secondaryFont} color={COLORS.white}>
                  Loading...
                </TextWrapper>
              </View>
            </View>
          </ModalComponent>
        )}
        {coursesLoading || loadings?.ipDataLoading ? (
          <View className="rounded-md p-2 items-center">
            <ShimmerPlaceholder
              // shimmerWidthPercent={0.4}
              style={{
                borderRadius: 8,
                width: width - 30,
                height: height - height / 3 - 30,
              }}></ShimmerPlaceholder>
          </View>
        ) : (
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
        )}

        <Spacer space={8} />
        <ShowCourses navigation={navigation} />
        {/* Reviews And Testimonials Here */}
        <Spacer space={12} />
        <ReviewsAndTestimonials />

        <Spacer space={16} />
      </ScrollView>

      <BottomSheetComponent
        isOpen={showAddChildView}
        onClose={() => setShowAddChildView(false)}
        Children={<AddChildModule onClose={() => setShowAddChildView(false)} />}
        snapPoint={['25%', '50%']}
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
