import {View, Text, Pressable, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated} from 'react-native';
import CourseDetails from './course-details.screen';
import BookDemoScreen from './book-demo-form.screen';
import BatchFeeDetails from './batch-fees-details.screen';
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import {FONTS} from '../utils/constants/fonts';

const BANNER_H = 190;
const CourseDetailsScreen = ({navigation, route}) => {
  // console.log("navigaion is", )
  const {bgColor, colorYlMain} = useSelector(state => state.appTheme);
  const scrollViewRef = useRef();
  const {courseData} = route.params;
  const {subScreenToShow} = route.params;
  // console.log("courseData", courseData);
  const [selectedTab, setSelectedTab] = useState('courseDetails');
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollA = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (subScreenToShow) {
      setSelectedTab(subScreenToShow || 'courseDetails');
    }
  }, [subScreenToShow]);

  const handleScroll = event => {
    const y = event.nativeEvent.contentOffset.y;
    setScrollPosition(y);
  };

  // const scrollToTop = () => {
  //   // console.log('Scrolling functions');
  //   scrollViewRef.current.scrollTo({y: 0, animated: true});
  // };

  const scrollToBottom = () => {
    // console.log('scrolling to bottom');
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  useEffect(() => {
    // console.log('scrolling useEffect...');
    if (selectedTab === 'bookFreeClass') {
      scrollToBottom();
    }
  }, [selectedTab]);

  return (
    <View className="w-full flex-1" style={{backgroundColor: bgColor}}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {useNativeDriver: true, listener: handleScroll},
        )}
        scrollEventThrottle={16}
        ref={scrollViewRef}>
        <View
          style={[styles.bannerContainer, {backgroundColor: colorYlMain}]}
          className="w-full relative justify-center">
          <FeatureTray
            scrollA={scrollA}
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
            demoAvailable={courseData?.demoAvailable}
          />
          <View
            className="absolute -bottom-4  py-4 rounded-full w-[100%]"
            style={{backgroundColor: bgColor}}></View>
        </View>
        <View className="flex-1 relative rounded-t-2xl pt-2 px-2 mb">
          <View className="flex-1">
            {selectedTab === 'courseDetails' ? (
              <CourseDetails navigation={navigation} courseData={courseData} />
            ) : selectedTab === 'bookFreeClass' ? (
              <BookDemoScreen
                navigation={navigation}
                courseId={courseData.id}
                setSelectedTab={setSelectedTab}
                demoAvailableType={courseData?.demoAvailableType}
              />
            ) : selectedTab === 'payAndEnroll' ? (
              <BatchFeeDetails
                navigation={navigation}
                courseData={courseData}
              />
            ) : (
              ''
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export const FeatureTray = ({
  scrollA,
  setSelectedTab,
  selectedTab,
  demoAvailable,
}) => {
  const courseDetailsImage = require('../assets/images/courseDetails.jpg');
  const bookFreeClassImage = require('../assets/images/demoBook.jpg');
  const payAndEnrollImage = require('../assets/images/payAndEnroll.jpg');
  const features = demoAvailable
    ? [
        {
          label: 'Course Details',
          value: 'courseDetails',
          imgPath: courseDetailsImage,
        },
        {
          label: 'Book Free Class',
          value: 'bookFreeClass',
          imgPath: bookFreeClassImage,
        },
        {
          label: 'Pay And Enroll',
          value: 'payAndEnroll',
          imgPath: payAndEnrollImage,
        },
      ]
    : [
        {
          label: 'Course Details',
          value: 'courseDetails',
          imgPath: courseDetailsImage,
        },
        {
          label: 'Pay And Enroll',
          value: 'payAndEnroll',
          imgPath: payAndEnrollImage,
        },
      ];
  const {darkMode, textColors, bgColor, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );

  const FeatureItem = ({feature}) => {
    return (
      <Pressable
        className="w-[120px] ml-2"
        onPress={() => setSelectedTab(feature.value)}
        key={feature?.value}>
        <View
          className={`py-1 rounded overflow-hidden px-1 items-center w-full bg-white justify-between h-[90%]`}
          style={{
            backgroundColor: selectedTab === feature?.value ? 'white' : 'white',
          }}>
          <Image
            source={feature.imgPath}
            style={{
              width: 100,
              height: 80,
              resizeMode: 'cover',
              borderRadius: 10,
            }}
            // className="h-15 w-15 bg-cover"
          />
          <Text
            className="text-[18px] text-center font-semibold"
            style={{
              color:
                selectedTab === feature?.value ? textColors.textYlMain : 'gray',
              fontFamily: FONTS.headingFont,
            }}>
            {feature.label}
          </Text>
        </View>
      </Pressable>
    );
  };
  return (
    <Animated.View
      style={[styles.banner(scrollA)]}
      className="flex justify-center items-center w-full h-full">
      <FlatList
        data={features}
        keyExtractor={item => item.value}
        renderItem={item => {
          // console.log('feature: ')
          return <FeatureItem feature={item.item} />;
        }}
        className=""
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
        showsHorizontalScrollIndicator={false}
        horizontal
      />
    </Animated.View>
  );
};

export default CourseDetailsScreen;

const styles = {
  bannerContainer: {
    marginTop: -1000,
    paddingTop: 1000,
    overflow: 'hidden',
  },
  banner: scrollA => ({
    height: BANNER_H,
    width: '100%',
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [-BANNER_H / 2, 0, BANNER_H * 0.75, BANNER_H * 0.75],
        }),
      },
      {
        scale: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [2, 1, 0.5, 0.5],
        }),
      },
    ],
  }),
  icon: {
    width: '100%',
    height: '100%',
  },
};
