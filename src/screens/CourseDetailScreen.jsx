import {View, Text, Pressable, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Animated} from 'react-native';
import CourseDetails from './course-details.screen';
import BookDemoScreen from './book-demo-form.screen';
import BatchFeeDetails from './batch-fees-details.screen';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlatList} from 'react-native-gesture-handler';
import {FONTS} from '../utils/constants/fonts';

const BANNER_H = 190;
const CourseDetailsScreen = ({route, navigation}) => {
  const {darkMode, textColors, bgColor, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  const scrollViewRef = useRef();
  const {courseData} = route.params;
  const {subScreenToShow} = route.params;
  // console.log("courseData", courseData);
  const [selectedTab, setSelectedTab] = useState('courseDetails');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [buttonToShow, setButtonToShow] = useState('top');
  const [showScrollerButton, setShowScrollerButton] = useState(true);

  const scrollA = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (subScreenToShow) {
      setSelectedTab(subScreenToShow || 'courseDetails');
    }
  }, [subScreenToShow]);

  const handleScroll = event => {
    const y = event.nativeEvent.contentOffset.y;
    setScrollPosition(y);
    // setTimeout(()=>{
    //   setShowScrollerButton(!showScrollerButton);
    // })
  };

  const scrollToTop = () => {
    // console.log('Scrolling functions');
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };

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

  const handleContentSizeChange = (contentWidth, height) => {
    // Update the content size state
    // setContentSize({ width: contentWidth, height: contentHeight });

    // Do any additional logic based on the content size if needed
    setContentHeight(height);
    console.log('Content Size:', height);
  };

  const handleLayout = event => {
    const {height} = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  useEffect(() => {
    if (selectedTab !== 'payAndEnroll') {
      // Check if the user is 20% from the top or bottom
      const isTop20Percent = scrollPosition < 0.15 * contentHeight;
      const isBottom20Percent =
        scrollPosition > 0.85 * (contentHeight - scrollViewHeight);

      // Perform actions based on scroll position
      if (isTop20Percent) {
        setButtonToShow('bottom');
      } else if (isBottom20Percent) {
        setButtonToShow('top');
      }
    }
  }, [scrollPosition, contentHeight, scrollViewHeight, selectedTab]);

  return (
    <View className="w-full flex-1" style={{backgroundColor: bgColor}}>
      {selectedTab !== 'payAndEnroll' && showScrollerButton && (
        <Pressable
          className="absolute bottom-[80px] right-5 h-12 w-12 z-50 rounded-full items-center justify-center"
          style={{backgroundColor: textColors.textYlMain}}
          onPress={() => {
            buttonToShow == 'top' ? scrollToTop() : scrollToBottom();
          }}>
          <View className="items-center justify-center">
            <MIcon
              name={buttonToShow === 'top' ? 'arrow-up' : 'arrow-down'}
              size={30}
              color="white"
            />
          </View>
        </Pressable>
      )}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {useNativeDriver: true, listener: handleScroll},
        )}
        scrollEventThrottle={16}
        ref={scrollViewRef}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}>
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
                data={{country: {callingCode: 91}, phone: 7668983758}}
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
  console.log('demoAvailable is', demoAvailable);
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

      {/* <View className="flex flex-row justify-around w-full h-full items-center">
        {features?.map(feature => {
          return (
            
          );
        })} */}

      {/* <Pressable
          className="w-[30%]"
          onPress={() => setSelectedTab('courseDetails')}>
          <View
            className={`py-1 rounded-full px-1 items-center w-full`}
            style={{
              backgroundColor:
                selectedTab === 'courseDetails'
                  ? textColors.textYlGreen
                  : 'white',
            }}>
            <View className="w-[100%] flex-row justify-between">
              <View className="w-[25%] justify-center">
                <MIcon
                  name="sort-alphabetical-descending"
                  size={30}
                  color={
                    selectedTab === 'courseDetails'
                      ? 'white'
                      : textColors.textYlGreen
                  }
                />
              </View>
              <Text
                className="w-[70%] text-[15px] font-semibold"
                style={{
                  color:
                    selectedTab === 'courseDetails'
                      ? 'white'
                      : textColors.textYlGreen,
                }}>
                Course Details
              </Text>
            </View>
          </View>
        </Pressable>

        {demoAvailable && (
          <Pressable
            className="w-[30%]"
            onPress={() => setSelectedTab('bookFreeClass')}>
            <View
              className={`py-1 rounded-full px-1 items-center w-full`}
              style={{
                backgroundColor:
                  selectedTab === 'bookFreeClass'
                    ? textColors.textYlOrange
                    : 'white',
              }}>
              <View className="w-[100%] flex-row justify-between">
                <View className="w-[25%] justify-center">
                  <MIcon
                    name="sort-alphabetical-descending"
                    size={30}
                    color={
                      selectedTab === 'bookFreeClass'
                        ? 'white'
                        : textColors.textYlOrange
                    }
                  />
                </View>
                <Text
                  className="w-[70%] text-[15px] font-semibold"
                  style={{
                    color:
                      selectedTab === 'bookFreeClass'
                        ? 'white'
                        : textColors.textYlOrange,
                  }}>
                  Book Free class
                </Text>
              </View>
            </View>
          </Pressable>
        )}

        <Pressable
          className="w-[30%]"
          onPress={() => setSelectedTab('payAndEnroll')}>
          <View
            className={`py-1 rounded-full px-1 items-center w-full`}
            style={{
              backgroundColor:
                selectedTab === 'payAndEnroll' ? textColors.textYlRed : 'white',
            }}>
            <View className="w-[100%] flex-row justify-between">
              <View className="w-[25%] justify-center">
                <MIcon
                  name="sort-alphabetical-descending"
                  size={30}
                  color={
                    selectedTab === 'payAndEnroll'
                      ? 'white'
                      : textColors.textYlRed
                  }
                />
              </View>
              <Text
                className="w-[70%] text-[15px] font-semibold"
                style={{
                  color:
                    selectedTab === 'payAndEnroll'
                      ? 'white'
                      : textColors.textYlRed,
                }}>
                Pay & Enroll
              </Text>
            </View>
          </View>
        </Pressable> */}
      {/* </View> */}
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

// <View className="flex-1 flex-col" style={{backgroundColor: COLORS.pblue}}>
//   <View className="items-center justify-center h-[20%]">
//     <View className="flex-row justify-around w-full">
//       <Pressable
//         className={`${buttonStyle} ${
//           selectedTab === 'courseDetail' ? 'bg-orange-600' : 'bg-white'
//         }`}
//         onPress={() => setSelectedTab('courseDetail')}>
//         <Text
//           className={`${buttonTextStyle} ${
//             selectedTab === 'courseDetail' ? 'text-white' : ''
//           }`}>
//           Course Details
//         </Text>
//       </Pressable>

//       <Pressable
//         className={`${buttonStyle} ${
//           selectedTab === 'bookDemo' ? 'bg-orange-600' : 'bg-white'
//         }`}
//         onPress={() => setSelectedTab('bookDemo')}>
//         <Text
//           className={`${buttonTextStyle} ${
//             selectedTab === 'bookDemo' ? 'text-white' : ''
//           }`}>
//           Book Demo
//         </Text>
//       </Pressable>

//       <Pressable
//         className={`${buttonStyle} ${
//           selectedTab === 'paymentTab' ? 'bg-orange-600' : 'bg-white'
//         }`}
//         onPress={() => setSelectedTab('paymentTab')}>
//         <Text
//           className={`${buttonTextStyle} ${
//             selectedTab === 'paymentTab' ? 'text-white' : ''
//           }`}>
//           Pay & Enroll
//         </Text>
//       </Pressable>
//     </View>
//   </View>

//   {/* Tab Switch Section */}
//   <View className="flex-1 rounded-t-[26px] bg-white justify-end">
//     <ScrollView className="h-[95%] px-1">
//       {selectedTab === 'courseDetail' ? (
//         <CourseDetailTab />
//       ) : selectedTab === 'bookDemo' ? (
//         <BookDemoTab />
//       ) : selectedTab === 'paymentTab' ? (
//         <PaymentTab />
//       ) : (
//         <CourseDetailTab />
//       )}
//     </ScrollView>
//   </View>
// </View>

// Tab navigator
{
  /* <Tab.Navigator
      screenOptions={{
        tabBarStyle: {backgroundColor: bgColor},
        tabBarIndicatorStyle:{
          backgroundColor:textColors.textYlMain
        }
      }}
      backBehavior="firstRoute">
      <Tab.Screen
        options={{
          title: ({color, focused}) => {
            return (
              <View className={`flex flex-row items-center gap-[2px]`}>
                <MIcon
                  name="sort-alphabetical-descending"
                  size={20}
                  color={
                    focused ? textColors.textYlMain : textColors.textSecondary
                  }
                />
                <Text
                  style={
                    focused
                      ? {color: textColors.textYlMain, fontWeight: 600}
                      : {color: textColors.textSecondary}
                  }>
                  Course Details
                </Text>
              </View>
            );
          },
        }}
        name="Course Details"
        component={CourseDetailTab}
      />
      <Tab.Screen
        options={{
          title: ({color, focused}) => {
            return (
              <View className="flex flex-row items-center gap-[4px]">
                <MIcon
                  name="google-classroom"
                  size={18}
                  color={
                    focused ? textColors.textYlMain : textColors.textSecondary
                  }
                />
                <Text
                  style={
                    focused
                      ? {color: textColors.textYlMain, fontWeight: 600}
                      : {color: textColors.textSecondary}
                  }>
                  Book Free class
                </Text>
              </View>
            );
          },
        }}
        name="Book Demo"
        component={BookDemoTab}
      />
      <Tab.Screen
        options={{
          title: ({color, focused}) => {
            return (
              <View className="flex flex-row items-center gap-[2px]">
                <MIcon
                  name="cash-check"
                  size={20}
                  color={
                    focused ? textColors.textYlMain : textColors.textSecondary
                  }
                />
                <Text
                  style={
                    focused
                      ? {color: textColors.textYlMain, fontWeight: 600}
                      : {color: textColors.textSecondary}
                  }>
                  Pay & Enroll
                </Text>
              </View>
            );
          },
        }}
        name="Pay & Enroll"
        component={PaymentTab}
      />
    </Tab.Navigator> */
}

// tabs
// function MyTabBar({state, descriptors, navigation, position}) {
//   const {bgColor, bgSecondaryColor, darkMode, textColors} = useSelector(
//     state => state.appTheme,
//   );
//   return (
//     <View
//       style={{flexDirection: 'row'}}
//       className={`${
//         darkMode ? `bg-[${bgSecondaryColor}]` : 'bg-gray-100'
//       } w-[100%] rounded-full mt-2 p-1 mb-[4px]`}>
//       {state.routes.map((route, index) => {
//         const {options} = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;
//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };

//         const inputRange = state.routes.map((_, i) => i);
//         const opacity = position.interpolate({
//           inputRange,
//           outputRange: inputRange.map(i => (i === index ? 1 : 0)),
//         });

//         const animatedOpacity = new Animated.Value(0);
//         // useEffect(() => {
//         //   if (isFocused) {
//         //     animatedOpacity.stopAnimation(); // Stop any previous animation
//         //     Animated.timing(animatedOpacity, {
//         //       toValue: 1,
//         //       duration: 300,
//         //       useNativeDriver: true,
//         //     }).start();
//         //   } else {
//         //     Animated.timing(animatedOpacity, {
//         //       toValue: 0,
//         //       duration: 300,
//         //       useNativeDriver: true,
//         //       onComplete: () => {
//         //         // Unmount the component after the animation finishes
//         //         // setIsFocused(false);
//         //       },
//         //     }).start();
//         //   }
//         // }, [isFocused, animatedOpacity]);
//         return (
//           <TouchableOpacity
//             accessibilityRole="button"
//             accessibilityState={isFocused ? {selected: true} : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{flex: 1}}
//             key={index}>
//             <View className="py-2 relative">
//               <Text
//                 className={`text-center w-full font-semibold text-[15px]`}
//                 style={
//                   isFocused
//                     ? {color: textColors.textYlMain}
//                     : {color: textColors.textSecondary}
//                 }>
//                 {label}
//               </Text>

//               {isFocused && (
//                 <Animated.View
//                   className="absolute w-full items-center -bottom-[3px]"
//                   // style={{opacity: animatedOpacity}}
//                 >
//                   <View
//                     className="w-[60%] p-[4px] rounded-t-lg"
//                     style={{backgroundColor: textColors.textYlMain}}></View>
//                 </Animated.View>
//               )}
//             </View>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }
