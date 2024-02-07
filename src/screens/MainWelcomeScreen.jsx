import {View, Text, Dimensions} from 'react-native';
import React, {Children, useEffect, useState} from 'react';
import tw from 'twrnc';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
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
import Testimonial from '../components/MainScreenComponents/Testimonial';
import {FONTS} from '../utils/constants/fonts';
import BookDemoScreen from './book-demo-form.screen';
import ShowCourses from '../components/MainScreenComponents/ShowCourses';
import ReviewsAndTestimonials from '../components/MainScreenComponents/ReviewsAndTestimonials';
import {fetchUser, fetchUserFormLoginDetails} from '../store/auth/reducer';
import {localStorage} from '../utils/storage/storage-provider';
import {useToast} from 'react-native-toast-notifications';
import {startFetchingUserOrders} from '../store/welcome-screen/reducer';
import auth from '@react-native-firebase/auth';
import {
  setIsFirstTimeUser,
  startFetchBookingDetailsByName,
} from '../store/user/reducer';
import {userSelector} from '../store/user/selector';

const {width, height} = Dimensions.get('window');

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
  const {customer, user} = useSelector(authSelector);
  const [showPostActions, setShowPostActions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeover, setIsTimeover] = useState(false);
  const [showAddChildView, setShowAddChildView] = useState(false);
  const [showChangeChildView, setShowChangeChildView] = useState(false);
  const [showBookFreeClassSheet, setShowBookFreeClassSheet] = useState(false);
  const [showRescheduleClassSheet, setShowRescheduleClassSheet] =
    useState(false);
  // console.log("user children is", user)

  const {bgColor, textColors, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  const {currentChild, children} = useSelector(userSelector);

  console.log('children are ', children);

  const {selectedChild} = useSelector(welcomeScreenSelector);

  const dispatch = useDispatch();
  const {
    demoData,
    loading,
    demoPhoneNumber,
    bookingDetails,
    teamUrl,
    isAttended,
    bookingTime,
  } = useSelector(joinDemoSelector);

  // console.log("user is", customer)

  // Fetching user details here
  useEffect(() => {
    let loginDetails = localStorage.getString('loginDetails');
    if (!user && loginDetails) {
      // console.log("gettin user details")
      dispatch(fetchUserFormLoginDetails());
    }
  }, [user]);

  // fetching user orders here
  useEffect(() => {
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
    // console.log('running for selectedChild', selectedChild.bookingId);
    if (currentChild) {
      if (currentChild?.bookingId) {
        setIsFirstTimeUser(false);
        dispatch(setToInitialState());
        dispatch(startFetchBookingDetailsFromId(currentChild?.bookingId));
      } else {
        dispatch(setIsFirstTimeUser(true));
      }
      // dispatch(startFetchBookingDetailsByName({childName :currentChild?.name}))
    } else if (user?.phone) {
      dispatch(startFetchBookingDetailsFromPhone(user.phone));
    }
  }, [user, currentChild]);

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
    // console.log('demo data here is');
    if (demoData && user?.phone) {
      console.log('dispatching function');
      dispatch(setDemoData({demoData, phone: user?.phone}));
    }
  }, [demoData, user, isTimeover]);

  useEffect(() => {
    if (!bookingTime) return;
    const isDemoOver =
      new Date(bookingTime).getTime() + 1000 * 60 * 50 <= Date.now();
    // console.log('demoData is', bookingDetails);
    if (
      isDemoOver &&
      isAttended &&
      teamUrl &&
      bookingDetails?.needMoreInfo !== true
    ) {
      setShowPostActions(true);
    } else {
      setShowPostActions(false);
    }
  }, [bookingTime, isAttended, teamUrl, bookingDetails]);

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
              ItemSeparatorComponent={() => {
                return <View className="p-1"></View>;
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
