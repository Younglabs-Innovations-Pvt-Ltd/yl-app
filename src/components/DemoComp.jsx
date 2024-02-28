import {View, Text, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {setDemoData} from '../store/join-demo/join-demo.reducer';
import {authSelector} from '../store/auth/selector';
import Demo from './demo.component';
import {redirectToCourse} from '../utils/redirectToCourse';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const {width, height} = Dimensions.get('window');

const DemoComp = ({navigation}) => {
  const dispatch = useDispatch();
  const [showPostActions, setShowPostActions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeover, setIsTimeover] = useState(false);
  const {customer, user, userFetchLoading} = useSelector(authSelector);
  const {bgColor, textColors, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  const {courses, coursesLoading} = useSelector(welcomeScreenSelector);

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

  return loading ? (
    <View>
      <ShimmerPlaceholder
        // shimmerWidthPercent={}
        style={{
          width: width,
          height: 20,
          borderRadius: 8,
        }}></ShimmerPlaceholder>
    </View>
  ) : (
    <View className="w-full" style={{backgroundColor: colorYlMain}}>
      <Demo
        timeLeft={timeLeft}
        isTimeover={isTimeover}
        showPostActions={showPostActions}
        // sheetOpen={() => setShowBookFreeClassSheet(true)}
        rescheduleClass={rescheduleClass}
      />
    </View>
  );
};

export default DemoComp;
